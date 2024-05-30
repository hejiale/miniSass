import api from '@/api'
import service from "@/services/game.js";

var canPay = false;
var confirming = false;

function login(code) {
    return new Promise(async (resolve, reject) => {
        //已登录成功的，不再获取token
        if (uni.getStorageSync('isLogin')) return;

        try {
            let res = await api.code2Session({ code });

            uni.setStorageSync('isLogin', true)
            uni.setStorageSync('SID', JSON.stringify(res.saTokenInfo))
            resolve();
        } catch (e) {
            uni.removeStorageSync('isLogin')
            reject();
        }
    })
}
// 判断用户是否拒绝地理位置信息授权，拒绝的话重新请求授权
function getUserLocation() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
                    wx.hideLoading();
                    wx.showModal({
                        title: '请求授权当前位置',
                        content: '需要获取您的地理位置，请确认授权',
                        success: function (res) {
                            if (res.cancel) {
                                wx.showToast({
                                    title: '拒绝授权',
                                    icon: 'none',
                                    duration: 1000
                                })
                                reject();
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用wx.getLocation的API
                                            getLocation().then(r => {
                                                resolve(r);
                                            }).catch(e => {
                                                reject(e);
                                            })
                                        } else {
                                            reject();
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'none',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) {
                    //调用wx.getLocation的API
                    getLocation().then(r => {
                        resolve(r);
                    }).catch(e => {
                        reject(e);
                    })
                }
                else {
                    //调用wx.getLocation的API
                    getLocation().then(r => {
                        resolve(r);
                    }).catch(e => {
                        reject(e);
                    })
                }
            }
        })
    })
}
// 获取定位当前位置的经纬度
function getLocation() {
    return new Promise((resolve, reject) => {
        wx.getLocation({
            type: 'gcj02',
            isHighAccuracy: true,
            success: function (res) {
                uni.setStorageSync('currentLongitude', res.longitude)
                uni.setStorageSync('currentLatitude', res.latitude)
                uni.setStorageSync('isLocation', true);
                resolve();
            },
            fail: function (e) {
                reject(e)
            }
        })
    })
}
// 隐私授权
function requestAuthorize() {
    return new Promise((resolve) => {
        if (!uni.getStorageSync("isLocation")) {
            wx.requirePrivacyAuthorize({
                success: async () => {
                    try {
                        await getUserLocalResolverCity();
                        resolve(uni.getStorageSync("cityInfo"))
                    } catch (e) {
                        resolve(uni.getStorageSync("cityInfo"))
                    }

                },
                fail: () => {
                    resolve(uni.getStorageSync("cityInfo"))
                }, // 用户拒绝授权
            });
        } else {
            resolve(uni.getStorageSync("cityInfo"))
        }
    })
}
//查询用户信息
function getUserInfo(needRefresh) {
    return new Promise(async (resolve, reject) => {
        if (!uni.getStorageSync('userInfo') || needRefresh) {
            try {
                let data = await api.getUserSelf({});
                uni.setStorageSync('userInfo', data)
                resolve(data);
            } catch (e) {
                reject(e)
            }
        }
        else {
            resolve(uni.getStorageSync('userInfo'))
        }
    })
}

//获取经纬度信息并解析城市
async function getUserLocalResolverCity() {
    return new Promise(async (resolve, reject) => {
        try {
            await getUserLocation();

            if (!uni.getStorageSync("currentLatitude") || !uni.getStorageSync("currentLongitude")) {
                return reject();
            }
            let data = await api.regionResolver({
                latitude: uni.getStorageSync("currentLatitude"),
                longitude: uni.getStorageSync("currentLongitude"),
                userId: uni.getStorageSync("userInfo").id,
                dataSource: "SAAS_MP"
            });
            let cityData = {
                cityId: data.cityId,
                districtId: data.districtId,
                city: data.city,
            }
            uni.setStorageSync("cityInfo", cityData);
            resolve();
        } catch (e) {
            reject();
        }
    })

}

//调起支付
function doPay(userId, totalAmount, productType, productName, productId, payUserType, lianlianUserType, quantity, lpActivityUserItem, storeId, coupon, deliveryAddressesId, gatheringId) {
    return new Promise(async (resolve, reject) => {
        if (canPay) return;
        canPay = true;

        wx.showLoading({ title: "支付中..." });

        try {
            //创单
            let info = await api.createOrder({
                userId,
                optUserId: userId,
                totalAmount,
                productType,
                productName,
                productId,
                payUserType,
                lianlianUserType,
                quantity,
                lpActivityUserItem,
                storeId,
                couponId: coupon ? coupon.id : null,
                gatheringId,
                deliveryAddressesId
            })

            //优惠券金额
            let couponPrice = coupon ? coupon.cutPrice : 0;

            if (totalAmount - couponPrice > 0) {
                try {
                    //预支付
                    let res = await api.paymentGw({
                        clientIp: uni.getStorageSync('localip'),
                        orderId: info.id,
                        payType: "WECHAT_WXA",
                        userId,
                    })

                    let paylod = JSON.parse(res.payload);
                    //微信支付
                    wx.requestPayment({
                        timeStamp: paylod.timeStamp,
                        nonceStr: paylod.nonceStr,
                        package: paylod.package,
                        signType: paylod.signType,
                        paySign: paylod.paySign,
                        rateLevel: paylod.rateLevel,
                        success: async () => {
                            wx.hideLoading();
                            canPay = false;
                            resolve(info.id)
                        },
                        fail: () => {
                            canPay = false;

                            uni.showToast({
                                title: "未完成支付！",
                                icon: "none",
                            });

                            reject();
                        },
                    });
                } catch (e) {
                    canPay = false;
                }
            } else {
                canPay = false;
                wx.hideLoading();
                resolve(info.id);
            }
        } catch (e) {
            canPay = false;
        }
    })
}

//订单支付
function orderPay(orderId, userId) {
    return new Promise(async (resolve, reject) => {
        if (canPay) return;
        canPay = true;

        try {
            //预支付
            let res = await api.paymentGw({
                clientIp: uni.getStorageSync('localip'),
                orderId,
                payType: "WECHAT_WXA",
                userId,
            })

            let paylod = JSON.parse(res.payload);
            //微信支付
            wx.requestPayment({
                timeStamp: paylod.timeStamp,
                nonceStr: paylod.nonceStr,
                package: paylod.package,
                signType: paylod.signType,
                paySign: paylod.paySign,
                rateLevel: paylod.rateLevel,
                success: async () => {
                    wx.hideLoading();
                    canPay = false;
                    resolve(res.orderTicketId)
                },
                fail: () => {
                    canPay = false;

                    uni.showToast({
                        title: "未完成支付！",
                        icon: "none",
                    });

                    reject();
                },
            });
        } catch (e) {
            canPay = false;
        }


    })
}

//玩家输房间号
function toTicketService(roomNum, userId) {
    return new Promise(async (resolve, reject) => {
        if (confirming || !roomNum || !roomNum.length) return;
        confirming = true;

        try {
            let lastHomeInfo = await service.checkUserCurrentGame({
                userId
            });

            if (lastHomeInfo.roomId) {
                if (lastHomeInfo.roomId && lastHomeInfo.roomId != roomNum) {
                    uni.showToast({
                        title: "需主持人结束旧房间才可进入新房间，房间最多存在12小时",
                        icon: "none",
                    });
                    confirming = false;
                } else {
                    if (lastHomeInfo.isDM) {
                        uni.navigateTo({
                            url: `/game-DM/pages/index?storeId=${lastHomeInfo.storeId}`,
                        });
                    } else {
                        uni.navigateTo({
                            url: `/game-player/pages/index?roomId=${lastHomeInfo.roomId}&id=${lastHomeInfo.recordId}`,
                        });
                    }
                    resolve();
                    confirming = false;
                }
            } else {
                try {
                    let roomInfo = await service.getRoomInfo({
                        roomId: roomNum,
                        userId,
                    });
                    if (
                        roomInfo.roomStatus === "CREATING" ||
                        roomInfo.roomStatus === "PLAYING"
                    ) {
                        uni.navigateTo({
                            url: `/game-player/pages/index?id=${roomInfo.recordId}&roomId=${roomInfo.roomId}`,
                        });
                        resolve();
                    } else {
                        uni.showToast({
                            title: "房间已关闭",
                            icon: "none",
                        });
                    }

                    confirming = false;
                } catch (e) {
                    reject();
                    confirming = false;
                }
            }
        } catch (e) {
            reject();
            confirming = false;
        }
    })
}

export default {
    getGrant() {
        uni.removeStorageSync('isLogin')

        return new Promise((resolve, reject) => {
            uni.login({
                success: async (res) => {
                    try {
                        await login(res.code)
                        resolve();
                    } catch (e) {
                        reject(e)
                    }
                },
                fail: (e) => {
                    reject();
                    uni.removeStorageSync('isLogin')
                }
            })
        })
    },
    login,
    getUserLocation,
    getUserInfo,
    getUserLocalResolverCity,
    requestAuthorize,
    doPay,
    orderPay,
    toTicketService
}
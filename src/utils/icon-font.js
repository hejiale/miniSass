function getIconName(name) {
  let url;
  let http = "https://juyyds.oss-cn-hangzhou.aliyuncs.com/juyou/";
  switch (name) {
    case "default-floor-bg":
      url = `${http}20231019/e41b5464-2218-4850-9d28-aad95c644451/default-floor-bg.png`;
      break;
    case "finance-bg":
      url = `${http}20230323/b01372ca5f164f248c77d48af06ac380/finance-bg.png`;
      break;
    case "icon-detail-bg":
      url = `${http}20221111/566888cac03a49a3af8be071d8283694/icon-detail-bg.png`;
      break;
    case "icon-company":
      url = `${http}20231019/1ccd1604-1b9f-4b9e-8a50-060f9857b6a9/icon-company.png`;
      break;
    case "icon-personal":
      url = `${http}20231019/4c2e80cf-deaf-4b70-89f7-792502b9111d/icon-personal.png`;
      break;
    case "icon-keFu":
      url = `${http}20231019/1aa0cdaf-95a4-4eba-ae0e-672a9b760bee/icon-keFu.png`;
      break;
    case "icon-store-bg":
      url = `${http}20221111/a80ac39720f44816817ffc7213f7ea96/icon-store-bg.png`;
      break;
    case "myStore-bg":
      url = `${http}20221111/647e0a0251fa4ff7bde75404b0fec55e/myStore-bg.png`;
      break;
    case "icon-takeAway-bg":
      url = `${http}20221111/053ee1e81aed446787eedd5a3d5977f7/icon-takeAway-bg.png`;
      break;
    case "menu-applyReocrd":
      url = `${http}20230426/671c783e-474b-4b71-94fc-c85021972b95/menu-applyReocrd.png`;
      break;
    case "menu-bureau":
      url = `${http}20230612/65f78bcb-af2b-4847-8c7f-5ccd684ae92b/menu-bureau.png`;
      break;
    case "menu-finance":
      url = `${http}20230426/31b211f2-a8b2-4744-8ff3-03027a3aace4/menu-finance.png`;
      break;
    case "menu-dramaManage":
      url = `${http}20230426/d6fecff1-1e7b-41da-904f-85d14ad80495/menu-dramaManage.png`;
      break;
    case "menu-formAssistant":
      url = `${http}20221111/81693ead7504407382bc6ee8105cf09f/menu-formAssistant.png`;
      break;
    case "menu-member":
      url = `${http}20230426/5dc4eb07-1702-4749-8a53-71b672e91898/menu-member.png`;
      break;
    case "menu-notice":
      url = `${http}20230426/1c128870-0dff-45f0-a5a7-c66b0b09457b/menu-notice.png`;
      break;
    case "menu-online":
      url = `${http}20230426/f241fb10-f75d-400c-9fd6-29082ec4c854/menu-online.png`;
      break;
    case "menu-order":
      url = `${http}20230612/0f48e93b-13eb-4ab9-aa97-0af92f77978a/menu-order.png`;
      break;
    case "menu-recommd":
      url = `${http}20230426/e95269dc-992f-4696-8919-2d9da31d7612/menu-recommd.png`;
      break;
    case "menu-snakManage":
      url = `${http}20230426/724e7ee3-1ce6-472c-9e25-322fb41aa6aa/menu-snakManage.png`;
      break;
    case "menu-snakOrder":
      url = `${http}20230426/11fe979c-7375-4f80-ad86-846768fc881e/menu-snakOrder.png`;
      break;
    case "menu-store":
      url = `${http}20230426/897f76cb-21e2-4589-b3bb-d9cb57408491/menu-store.png`;
      break;
    case "menu-takeaway":
      url = `${http}20230612/e46d577c-fb00-460b-b2af-9ebde7b5beb3/menu-takeaway.png`;
      break;
    case "menu-ticketRecord":
      url = `${http}20230426/686ac4e4-c2cb-46bb-baea-be6281d02ca1/menu-ticketRecord.png`;
      break;
    case "menu-compere":
      url = `${http}20221208/87db5bd4ba9940549059946535c14984/menu-compere.png`;
      break;
    case "menu-appraise":
      url = `${http}20221208/c866c16f331640bfb2fd19277f5cf64c/menu-appraise.png`;
      break;
    case "menu-compereManage":
      url = `${http}20230426/a082ec7b-cd04-4d43-ba95-b2a00e3d3157/menu-compereManage.png`;
      break;
    case "menu-applyAssistant":
      url = `${http}20230426/95ee14c2-b6e9-4670-80c0-31cfc978a982/menu-applyAssistant.png`;
      break;
    case "menu-coupon":
      url = `${http}20230426/305333ff-75d6-488c-918c-ca78ec8aa3dd/menu-coupon.png`;
      break;
    case "menu-address":
      url = `${http}20230426/db0c6779-d50e-4c31-ab94-255b1da26634/menu-address.png`;
      break;
    case "menu-applyDrama":
      url = `${http}20230426/6523ebd8-afb4-4abd-bf62-eac6b962f1f8/menu-applyDrama.png`;
      break;
    case "menu-merchant":
      url = `${http}20230426/75e3d1b0-8767-444d-aca1-d89d9904ea8d/menu-merchant.png`;
      break;
    case "menu-uploadDrama":
      url = `${http}20230511/3d17db74-9663-4bff-afd4-2f143b6a604b/menu-uploadDrama.png`;
      break;
    case "menu-dramaPrice":
      url = `${http}20230511/ba99abe5-051a-441a-b0d8-d39e6e5f641b/menu-dramaPrice.png`;
      break;
    case "menu-DM":
      url = `${http}20230612/9aab86fd-bf8b-4519-b8de-90c56cd99633/menu-DM.png`;
      break;
    case "menu-storeOut":
      url = `${http}20230612/4d4ff9a7-7c84-49a6-b60e-e6f9e7314b67/menu-storeOut.png`;
      break;
    case "menu-balance":
      url = `${http}20230612/5b1fd525-5eaf-4831-b1d8-aee562896274/menu-balance.png`;
      break;
    case "icon-noneStore":
      url = `${http}20221114/d743bf85e8b144cea14b20023dc69c3d/icon-noneStore.png`;
      break;
    case "icon-none-wifi":
      url = `${http}20221114/98427f0b67c947f9bd9d664a9cd19e48/icon-none-wifi.png`;
      break;
    case "noDataImg":
      url = `${http}20221114/91bdcf476e284ff98911cc5b75652e7c/noDataImg.png`;
      break;
    case "apply-progress-1":
      url = `${http}20230106/1472787230ea45e09a619f6ba1f5a4a0/apply-progress-1.png`;
      break;
    case "apply-progress-2":
      url = `${http}20230106/2220814c377c4cddb8874760afa160ab/apply-progress-2.png`;
      break;
    case "apply-progress-3":
      url = `${http}20230106/f7b80843a2004a6eb67660d87646a7f7/apply-progress-3.png`;
      break;
    case "apply-progress-4":
      url = `${http}20230106/133955a6dd344c95bafc8d7046b16113/apply-progress-4.png`;
      break;
    case "icon-search":
      url = `${http}20221206/64b5775e20e44ce5b7a25f7ad5340b98/icon-search.png`;
      break;
    case "icon-searchDeep":
      url = `${http}20230103/dd0fbfdb92804bc2b7d6a31ca3b4ca27/icon-searchDeep.png`;
      break;
    case "manage-bg":
      url = `${http}20221129/f06806b1be9e4653a06ae6a30bfe6dba/manage-bg.png`;
      break;
    case "userPlay-list-bookshelf":
      url = `${http}20230209/3a8da243879a4f0ea5d41ea6d8bb10c2/userPlay-list-bookshelf.png`;
      break;
    case "userPlay-list-bookrack":
      url = `${http}20230209/3d92b278eced4dbabdbc499fc48fc955/userPlay-list-bookrack.png`;
      break;
    case "userPlay-detail-bookshelf":
      url = `${http}20230209/d54d48fab853499ea8c87f989e328b70/userPlay-detail-bookshelf.png`;
      break;
    case "userPlay-detail-bookrack":
      url = `${http}20230209/66093a406b584a199e82f3207a73b431/userPlay-detail-bookrack.png`;
      break;
    case "userPlay-empty":
      url = `${http}20230215/e977ccbe0d55467d9a680e530734e194/userPlay-empty.png`;
      break;
    case "userPlay-empty2":
      url = `${http}20230215/140a6b5c3dc9451b86d2fa890c5e83d7/userPlay-empty2.png`;
      break;
    case "ticketService-bg":
      url = `${http}20230303/4c40ad957a3145cb9683fc04429d68f8/ticketService-bg.png`;
      break;
    case "bg-standard-dm":
      url = `${http}20230303/fac70bd449904beb9d6c3558f1d72f0c/bg-standard-dm.png`;
      break;
    case "threadBg-standard-dm":
      url = `${http}20230303/9f521a3cfbd1493fb39d50928d19fe7b/threadBg-standard-dm.png`;
      break;
    case "unThreadBg-standard-dm":
      url = `${http}20230303/5bc8cf14cc2e4d1cab8560589d5b87f8/unThreadBg-standard-dm.png`;
      break;
    case "juYouColor":
      url = `${http}20230314/e02f75c2060f42aa96c65f1862514a53/juYouColor.png`;
      break;
    case "cancel":
      url = `${http}20230316/534cb2ec6f034686abb8eb161f553a85/cancel.png`;
      break;
    case "confirm-open":
      url = `${http}20230316/670ed8d1d8a840b08780960b4e0c96a2/confirm-open.png`;
      break;
    case "kaila-confirmOpen":
      url = `${http}20230316/87158973df194e8f9b24443e5dabc6c8/kaila-confirmOpen.png`;
      break;
    case "kaila-cancel":
      url = `${http}20230316/8e078de9618b49829eb9240605d50dce/kaila-cancel.png`;
      break;
    case "icon-dramaDetail-buyBg":
      url = `${http}20230317/0bc3d513afcf4507afb02bdb7021f6e0/icon-dramaDetail-buyBg.png`;
      break;
    case "activity-bg":
      url = `${http}20230602/c0cf28dc-172b-432d-9599-c7293c975f01/activity-bg.png`;
      break;
    case "icon-contact":
      url = `${http}20230404/6b067494097c4679b0568a00cccbc14b/icon-contact.png`;
      break;
    case "icon-invite":
      url = `${http}20230404/abcb74c3f0d2466dbfcfdd2185214e88/icon-invite.png`;
      break;
    case "icon-applyDrama":
      url = `${http}20230602/440cd16f-e7fc-4229-a710-cd0e7557666e/icon-applyDrama.png`;
      break;
    case "icon-openDrama":
      url = `${http}20230602/8b93bc5f-b228-4cee-a156-7db8e309f8cc/icon-openDrama.png`;
      break;
    case "icon-dm":
      url = `${http}20230505/b38e778221504203b0698e231a726610/icon-dm.png`;
      break;
    case "icon-dm-select":
      url = `${http}20230505/e516ab623fd04839a2206211894ad812/icon-dm-select.png`;
      break;
    case "icon-employee":
      url = `${http}20230505/6112eed386604b4e8656dfef40f70944/icon-employee.png`;
      break;
    case "icon-employee-select":
      url = `${http}20230505/8b8848d9f79c4f7d9a75e53b445a1239/icon-employee-select.png`;
      break;
    case "icon-shopDirector":
      url = `${http}20230505/b505a43f9c3643baac92d0c01ec9ff0c/icon-shopDirector.png`;
      break;
    case "icon-shopDirector-select":
      url = `${http}20230505/284a6cf6dffc449ca66fa69e552b4389/icon-shopDirector-select.png`;
      break;
    case "bg-updateJob":
      url = `${http}20230505/e1180653337d4aa48696ddf1d3e52dcd/bg-updateJon.png`;
      break;
    case "bg-personnel":
      url = `${http}20230505/1757838aa6b3430ea6b1876e549e771f/bg-personnel.png`;
      break;
    case "bg-invite":
      url = `${http}20230505/3dbc9b965cb742239e5e0a3fd85f602a/bg-invite.png`;
      break;
    case "invite-dm":
      url = `${http}20230506/5e13fd3c-3cbf-489b-87a6-8935867beb1f/invite-dm.png`;
      break;
    case "invite-employee":
      url = `${http}20230612/6b65b73c-7dea-4dc4-9de2-b3395d069d15/invite-employee.png`;
      break;
    case "invite-shopDirector":
      url = `${http}20230506/8a7946b3-122b-47d4-a25a-3eef2db4071b/invite-shopDirector.png`;
      break;
    case "updateDramaPirce":
      url = `${http}20230511/9587c098-a4b7-4a46-b2f6-4f390df977b9/updateDramaPirce.png`;
      break;
    case "jigsaw-bg":
      url = `${http}20230620/50dc9d1f-ae4b-4eb5-8b0e-2c8caddd9c15/jigsaw-bg.png`;
      break;
    case "jigsaw-logo":
      url = `${http}20230620/aec2f556-1eaa-4444-8410-91b8ab430376/jigsaw-logo.png`;
      break;
    case "jigsaw-success":
      url = `${http}20230621/c90314b1-c46c-4473-af81-e4a61bc1af8a/jigsaw-success.png`;
      break;
    case "jigsaw-gif":
      url = `${http}20230621/a4c0bac4-3e34-4c80-85f3-4f648aad639d/jigsaw-gif.gif`;
      break;
    case "jigsaw-successLogo":
      url = `${http}20230625/8bd31f7c-7166-4869-854b-9a27325a5d9d/jigsaw-successLogo.png`;
      break;
    case "icon-store-example":
      url = `${http}20230621/9197a678-53c8-4873-99cc-a8ffd0aacea2/icon-store-example.png`;
      break;
    case "DM-bureau-bg":
      url = `${http}20230704/eca3dc5b-cd0f-45f9-a538-174e0a22b438/DM-bureau-bg.png`;
      break;
    case "bureau-detail-bg":
      url = `${http}20230704/ffef53cb-f53b-4eee-9a68-603d24a5c8b6/bureau-detail-bg.png`;
      break;
    case "icon-gather-bg":
      url = `${http}20230705/582c45ed-c1c4-4594-b1a1-e3ca332bc412/icon-gather-bg.png`;
      break;
    case "gather-bottom":
      url = `${http}20230705/ae24d6f7-4c1d-4eec-94b8-77f07feef101/gather-bottom.png`;
      break;
    case "gather-empty":
      url = `${http}20230705/9ad0f3f2-8e2e-41bb-97ee-3b8131efd8b4/gather-empty.png`;
      break;
    case "icon-goGather":
      url = `${http}20230706/226b2d60-8403-4a2d-97d4-18ece48877b5/icon-goGather.png`;
      break;
    case "icon-order-bg":
      url = `${http}20230711/b31e0564-f739-461c-80f3-9da72c5ffadd/icon-order-bg.png`;
      break;
    case "input-border":
      url = `${http}20230713/e6a59def-830a-4db7-9e35-257c16aee400/input-border.png`;
      break;
    case "password-border":
      url = `${http}20230713/0640d0bd-0793-40e8-b258-08b23b9e88ed/password-border.png`;
      break;
    case "lib-cd":
      url = `${http}20230719/82fb6c25-be36-4d22-8c7e-81ef617e6e14/lib-cd.png`;
      break;
    case "tool-jigsaw":
      url = `${http}20230720/d8e05e1e-e098-41fd-bc12-b2dd554a8b86/tool-jigsaw.png`;
      break;
    case "tool-question":
      url = `${http}20230720/d90cb444-f142-4743-80d1-81350d3a05c8/tool-question.png`;
      break;
    case "tool-stochastic":
      url = `${http}20230720/c6bfad68-ca61-4d2d-84c2-10321daf2ded/tool-stochastic.png`;
      break;
    case "tool-tel":
      url = `${http}20230720/7b47dc6f-cb56-41d9-8a96-f96e642729e2/tool-tel.png`;
      break;
    case "tool-vote":
      url = `${http}20230720/8dfac530-3419-4dc5-9a60-7a32fdc1c996/tool-vote.png`;
      break;
    case "leftActive":
      url = `${http}20230720/35aa0fc0-e42c-486a-8dc1-d75c63a2eb72/leftActive.png`;
      break;
    case "selectRole":
      url = `${http}20230720/b4f4e481-2f34-45f3-b978-cc39e900da44/selectRole.png`;
      break;
    case "pintu-border":
      url = `${http}20230725/84253c38-4010-4780-9ada-a4330a655a8b/pintu-border.png`;
      break;
    case "menu-withdrawal":
      url = `${http}20231008/917ef96d-1a20-4429-97e1-7cc339b0ca7f/menu-withdrawal.png`;
      break;
    case "liveAction":
      url = `${http}20231024/a0677c2b-ffec-4246-892e-c4cb24a8a1bd/liveAction.png`;
      break;
    case "Citylimit":
      url = `${http}20231024/be3ee227-a930-4bda-9da7-7069509dedb2/Citylimit.png`;
      break;
    case "exclusive":
      url = `${http}20231024/a0bd575d-4e06-4395-9d5c-2f94b10f676c/exclusive.png`;
      break;
    case "juyouone":
      url = `${http}20231024/79904310-95c5-4343-a038-a73b49d9bb17/juyouone.png`;
      break;
    case "visit":
      url = `${http}juyou/20231024/44e3e133-179a-47d0-b6ec-007cd2a37570/visit.png`;
      break;
    case "mzan":
      url = `${http}20231024/80a76079-a6d9-40b5-a995-854149fd89bc/mzan.png`;
      break;
    case "address-bg":
      url = `${http}20231107/cb8396b6-48b1-473a-96f4-689b2ed9a2d6/address-bg.png`;
      break;
    case "searchindex":
      url = `${http}20231110/ebeedccf-2c47-4fb7-a285-9928f43eff91/searchindex%403x.png`;
      break;
    case "scan-index":
      url = `${http}20231110/46667317-85d7-484d-875d-21cb0c3cc6c4/saomaindex%403x.png`;
      break;
    case "arrowright":
      url = `${http}20231110/aa4e3c56-6660-495e-806e-2fbc6ab3ae41/arrow-right%403.png`;
      break;
    case "kzan":
      url = `${http}20231227/8603e1f7-da75-4b08-93d9-da03b959d13b/kzan.png`;
      break;
    case "arrowright-white":
      url = `${http}20231110/4eb16ec4-ff77-4962-904e-7ada25d41466/arrowright-white%403x.png`;
      break;
    case "downarrow":
      url = `${http}20231110/d42f5cd4-9215-4839-9b8d-f972898b4ab4/downarrow%403x.png`;
      break;
    case "downarrowright":
      url = `${http}20231110/ac29ed24-229f-4e6a-83d6-22edb65b93ba/rightarrow%403x.png`;
      break;
    case "aixin":
      url = `${http}20231110/01f62391-26a5-47c6-8293-cfc6d630d34c/aixin.png`;
      break;
    case "closeaixin":
      url = `${http}20231110/99e7d566-94eb-4a38-bc56-12d1b41ded7c/closeaixin.png`;
      break;
    case "wuxin":
      url = `${http}20231110/74ea6e73-621f-4467-afb9-5e61bafe39c5/wuxin.png`;
      break;
    case "full-score-masterpiece":
      url = `${http}20231110/00c578d7-cc6d-4873-953c-a91923ff5cea/manfenshenzuo.png`;
      break;
    case "closedialog":
      url = `${http}20231110/ebf8bc60-29b0-407b-b2fb-44f5579695de/closedialog.png`;
      break;
    case "no":
      url = `${http}20231110/4c1f6b52-3a34-468b-bed2-8727fe5c879a/no.png`;
      break;
    case "no-active":
      url = `${http}20231110/e138d520-381f-4fe8-8481-7e3ffeddfab3/no-active.png`;
      break;
    case "generally":
      url = `${http}20231110/98b837dc-5c33-4a4a-8fdd-11968e5f743e/generally.png`;
      break;
    case "generally-active":
      url = `${http}20231110/969ebe0e-11eb-40d4-91a1-39e0ba719f33/generally-active.png`;
      break;
    case "recommend":
      url = `${http}20231110/e3c38d9a-cc05-48b4-a283-02679098e47d/recommend.png`;
      break;
    case "recommend-active.png":
      url = `${http}20231110/e6836a67-4f9f-4027-828b-aa2b2f3c9ea8/recommend-active.png`;
      break;
    case "myava":
      url = `${http}20231110/55ae18f2-bf89-4728-8e5a-665c8b8a1d96/myava.png`;
      break;
    case "dianpu":
      url = `${http}20231110/01810484-a5c8-471d-b049-addeb183aa1c/dianpu.png`;
      break;
    case "sharepl":
      url = `${http}20231110/a3ab35c7-80e2-4579-b789-dae4dcafee99/sharepl.png`;
      break;
    case "pinglun":
      url = `${http}20231110/3425edf9-4314-4ec1-8ecb-e387c645f180/pinglun.png`;
      break;
    case "share":
      url = `${http}20231110/cf82f448-f1ee-4716-9be6-b56422c02d62/share.jpg`;
      break;
    case "pgyclose":
      url = `${http}20231110/bf4b97ca-275a-42fd-898b-76c15c93bc8d/pgyclose.png`;
      break;
    case "plusjia":
      url = `${http}20231110/1cb68dd9-ac8f-49a5-831e-dc052f901bd2/plusjia.png`;
      break;
    case "sel-tyrole":
      url = `${http}20231110/f840150f-0fbc-48e6-bfdc-07875c933748/sel-tyrole.png`;
      break;
    case "tyrole":
      url = `${http}20231110/65a3b207-426d-44b7-92d7-0f3f04d07627/tyrole.png`;
      break;
    case "bgtp":
      url = `${http}20231110/8222a654-df4b-4cc5-90c9-6ebd0c784451/bgtp.png`;
      break;
    case "selected-icon":
      url = `${http}20231215/c5471f63-c8d0-4033-ad06-3cfedd10db70/seleced-icon-x.png`;
      break;
    case "selectgou":
      url = `${http}20231110/d7d01cb9-4656-44dd-8391-ae8629aeae1e/selectgou.png`;
      break;
    case "circlepingjia":
      url = `${http}20231110/4be468a6-176c-4335-b2bb-f6e9d2b7b58d/circlepingjia.png`;
      break;
    case "charter":
      url = `${http}20231110/9a8250b9-7182-43ba-a3ad-1c7acb5573bb/charter.png`;
      break;
    case "selectcharter":
      url = `${http}20231110/962bb94d-b122-4b08-a432-33eda34b48f5/selectcharter.png`;
      break;
    case "avater":
      url = `${http}20231110/e3b8d4e2-f4b4-4966-af90-a0f967400b66/avater.png`;
      break;
    case "selectavater":
      url = `${http}20231110/5bf26408-ad0a-4c65-9189-1b2ee9aa8144/selectavater.png`;
      break;
    case "houseing":
      url = `${http}20231110/a277fcd6-9985-4308-ac4e-5c8206842a6e/houseing.png`;
      break;
    case "selecthouseing":
      url = `${http}20231110/46681f96-319d-422f-965b-be98304ca50d/selecthouseing.png`;
      break;
    case "staring":
      url = `${http}20231110/e6a2b468-9db4-4709-9a06-28bd956f0213/staring.png`;
      break;
    case "selectstaring":
      url = `${http}20231110/82ba220e-a283-47d4-9dd2-31e64a0094a9/selectstaring.png`;
      break;
    case "fabubutton":
      url = `${http}20231110/86c90376-27f7-4c48-a832-95a27a45984c/fabubutton%403.png`;
      break;
    case "leftmao":
      url = `${http}20231112/502cf1f6-f697-4da7-b423-ff230a59dffa/leftmao.png`;
      break;
    case "rightmao":
      url = `${http}20231112/ae7f5c5f-c030-4fec-90e4-24ab400f2215/rightmao.png`;
      break;
    case "evaluate-bg":
      url = `${http}20231109/4aee74f4-cc63-45a7-9f22-b52b6864b353/evaluate-bg.png`;
      break;
    case "full-star":
      url = `${http}20231109/30c9922d-2017-4099-b22f-ec01a8979c8a/full-star.png`;
      break;
    case "none-star":
      url = `${http}20231109/2985f3b7-8803-4e2c-9d66-43ba2c5f0ebd/none-star.png`;
      break;
    case "dynamic-avatar":
      url = `${http}20231114/f1ff9e6a-f118-4194-85b1-76546665faf5/indexfirst.png`;
      break;
    case "avateruser":
      url = `${http}20231114/553b6fb3-c067-4861-b74c-e56a5161c9f4/avateruser.png`;
      break;
    case "zuozhe":
      url = `${http}20231115/7d3cdfd5-dae7-4221-9a1c-8f59bc8273af/zuozhe.png`;
      break;
    case "fahang":
      url = `${http}20231115/7c57ce1e-bda1-437a-a7c4-6c86ea6d9ccb/fahang.png`;
      break;
    case "shandian":
      url = `${http}20231124/49f3c603-834c-4b3e-bfc4-ec77130a6ec0/shandian.png`;
      break;
    case "must-play-drama-game":
      url = `${http}20231124/cd9e2189-21d7-4116-9eb6-73f1084d626b/juyoubiwan.png`;
      break;
    case "horizontal-online":
      url = `${http}20231124/1d12ea9e-2f43-410c-83a9-440650c50349/shuipingzaixian.png`;
      break;
    case "high-quality-plays":
      url = `${http}20231124/c2c4e924-5c61-45da-a772-3f629c03768b/youzhijuzuo.png`;
      break;
    case "zhideyis":
      url = `${http}20231127/f82d9b43-b48e-4c93-864d-f8e30ebee6e2/zhideys.png`;
      break;
    case "juyoutime":
      url = `${http}20231124/00860a2d-76d6-4c2d-9f6c-47845e3737ed/juyoutime.png`;
      break;
    case "background":
      url = `${http}20231124/7ef57159-7f67-410f-85e1-b4e7817b9c2b/logoimage.png`;
      break;
    case "zudui":
      url = `${http}20231124/b8db9086-f7d3-440d-bfdb-f2f5fa4a1bc2/zudui.png`;
      break;
    case "jybiwan":
      url = `${http}20231125/3d314932-54f3-4ce0-90a1-b305d69c575f/juyoubiwan.png`;
      break;
    case "manfenzw":
      url = `${http}20231125/024c366b-133d-4b82-9698-e5cf41d30422/manfenzuowen.png`;
      break;
    case "suipzaix":
      url = `${http}20231125/4c3e160e-aff1-4c5b-9860-bb27c8187888/shuipingzaix.png`;
      break;
    case "youzhijz":
      url = `${http}20231125/1889f60c-3f07-4816-b33c-726657d8b938/youzhizuow.png`;
      break;
    case "worth-a-try":
      url = `${http}20231125/f0c8397d-e6d7-4714-bf0e-23308ca71076/zhideyishi.png`;
      break
    case "zanwupingjia":
      url = `${http}20231124/14f20008-6a07-4e4a-a376-6df99ff51a03/zanwupingjia.png`;
      break;
    case "top1":
      url = `${http}20231126/7b7d9ff5-c013-46be-a7e2-4ed00e2e49c3/top1.png`;
      break;
    case "top2":
      url = `${http}20231126/0b80718e-b81b-4e14-abe1-7ed181a8bfcb/top2.png`;
      break;
    case "top3":
      url = `${http}20231126/bde30cb7-b84d-4a2c-9225-b756202ac06b/top3.png`;
      break;
    case "index-arrow-down":
      url = `${http}20231126/dc699108-cd56-4fe6-8d5a-924d746af736/indexarrowdown.png`;
      break;
    case "index-black-arrow-down":
      url = `${http}20231204/f7c4801e-3117-4560-bb3c-7765e7746ce3/Frame%201171276732%402x.png`;
      break;
    case "add":
      url = `${http}20231127/ef50b841-c503-4487-ac10-f1021a4b2b91/add.png`;
      break;
    case "add-scroll":
      url = `${http}20231127/da4d2614-b267-4085-afab-9fecb3ab9530/add-scroll.png`;
      break;
    case "hot-list":
      url = `${http}20231127/0990fd56-cecd-44ec-9e43-5b7a4301fde1/hot-list.png`;
      break;
    case "overall-list":
      url = `${http}20231127/21180713-c45f-4313-967a-9fa6d1380f9a/overall-list.png`;
      break;
    case "poster-top":
      url = `${http}20231124/0e14b45c-b081-4dcc-b91c-261b24ac63f5/poster-top.png`;
      break;
    case "poster-bottom":
      url = `${http}20231124/c72df81a-4c88-4ef3-8ba4-f5ab65bf2ba8/poster-bottom.png`;
      break;
    case "tag-1":
      url = `${http}20231124/3c3e5556-77ef-417a-9c11-cc3feff0cbd0/tag-1.png`;
      break;
    case "tag-2":
      url = `${http}20231124/65f85410-7a16-498a-a0f0-5d32fc5ab79b/tag-2.png`;
      break;
    case "tag-3":
      url = `${http}20231124/902d086d-5ebd-4250-b75b-6ddb37b8f45d/tag-3.png`;
      break;
    case "tag-4":
      url = `${http}20231124/f26122e1-2454-4ae2-be32-d9a722d2921b/tag-4.png`;
      break;
    case "tag-5":
      url = `${http}20231124/702160e1-653e-4e33-912d-e02d36064783/tag-5.png`;
      break;
    case "tag-6":
      url = `${http}20231124/695f0e5a-7689-4358-a4be-2b5dcb5c5992/tag-6.png`;
      break;
    case "tag-7":
      url = `${http}20231124/18fad170-3ca0-4741-8c56-9e563f06ab6a/tag-7.png`;
      break;
    case "tag-8":
      url = `${http}20231124/7a3cfdc9-5d98-407d-b1f3-546d4aaa4ab1/tag-8.png`;
      break;
    case "tag-9":
      url = `${http}20231124/1d8dfe94-9f7c-40fc-8878-ba5c38404413/tag-9.png`;
      break;
    case "tag-10":
      url = `${http}20231124/7bff76e4-e1d0-43d6-b37b-fc91dc1129ad/tag-10.png`;
      break;
    case "icon-rank-title":
      url = `${http}20231124/69b9c07f-6d5f-45ea-83b7-1d540f257d14/icon-rank.png`;
      break;
    case "icon-place":
      url = `${http}20231124/9109074a-fecb-4e0f-8117-ae3588dfa11f/icon-place.png`;
      break;
    case "icon-phone":
      url = `${http}20231124/d0d1dd32-49d1-4513-9734-78e797b280a7/icon-phone.png`;
      break;
    case "icon-wechat":
      url = `${http}20231124/ac049211-ec81-4e0d-9f91-c4675fe207f2/icon-wechat.png`;
      break;
    case "icon-dark-bg":
      url = `${http}20231127/6b3111fb-8e46-4830-9331-7895df158bac/icon-dark-bg.png`;
      break;
    case "paihangbang":
      url = `${http}20231127/3eb93d15-a8c4-4a60-8254-ea9982c1d248/paihangbang.png`;
      break;
    case "scriptEvaluatePoster-bg":
      url = `${http}20231128/a2b6e2ed-5d62-4524-bc54-36fde2e79b01/scriptEvaluatePoster-bg.png`;
      break;
    case "scriptEvaluatePoster-tag":
      url = `${http}20231128/4695a898-d86b-4877-91bd-438c1629201f/scriptEvaluatePoster-tag.png`;
      break;
    case "evaluate-star":
      url = `${http}20231128/4eab9a2c-52fa-46e6-a15d-0621ccab41bb/evaluate-star.png`;
      break;
    case "evaluate-nice":
      url = `${http}20231128/25dbb984-f13a-4b0f-a871-27b9720a0dd7/evaluate-nice.png`;
      break;
    case "evaluate-no":
      url = `${http}20231128/b240ab0a-111c-4dbd-b406-7f4d73f3907a/evaluate-no.png`;
      break;
    case "evaluate-normal":
      url = `${http}20231128/97df7f13-b9ed-4b3e-844b-ebeba04da35e/evaluate-normal.png`;
      break;
    case "brown-button":
      url = `${http}20231128/b9961c9f-63f3-466f-a020-96b23681897c/zongseButton.png`;
      break;
    case "no-expression":
      url = `${http}20231128/183f3b46-e28c-4e8d-a36b-f19f431b7058/buxingem.png`;
      break;
    case "recommended-emoji":
      url = `${http}20231128/85fd9fc4-3920-427e-8e3a-00349f26e134/tuijianem.png`;
      break;
    case "general-facial-expressions":
      url = `${http}20231128/3db7bd75-f7a4-4a11-bb1b-f75af4f7a45f/yibanem.png`;
      break;
    case "third-hotlist":
      url = `${http}20231128/61fd3f66-8399-4db5-801e-089109e63743/thirdhotbang.png`;
      break;
    case "EXCLUSIVE":
      url = `${http}20231129/38d52adf-b5f7-4390-a6db-12af29ce5200/exclusive.png`;
      break;
    case "REAL_SCENE":
      url = `${http}20231129/15edb47b-e1ac-4895-96ed-60d6f9ad5a19/real_scene.png`;
      break;
    case "LIMITED":
      url = `${http}20231129/e011cb9d-093a-4421-81a2-90dd9846817d/limited.png`;
      break;
    case "groupButton":
      url = `${http}20231130/5f9e8ab5-530a-4edd-8eaa-403efdecd8fe/groupButton.png`;
      break;
    case "beforGo":
      url = `${http}20231130/beb11723-654c-4548-9684-8d850a290c9f/beforGo.png`;
      break;
    case "hot-rank-background":
      url = `${http}20231204/04fe5a8a-4561-4885-9b6e-3e96db27880e/Mask%20group%403x.png`;
      break;
    case "praise-rank-background":
      url = `${http}20231204/c366cc7d-68f7-4e81-ad6b-ba745acb8559/Mask%20group%403x%20%282%29.png`;
      break;
    case "focus-rank-background":
      url = `${http}20231204/dd67ce13-d42a-46fd-ad96-7095d38f2031/Mask%20group%403x%20%284%29.png`;
      break;
    case "gather-sum-rank-background":
      url = `${http}20231204/ad8fbed4-a33c-475a-bd2d-8de5b1ef9cfb/Mask%20group%403x%20%281%29.png`;
      break;
    case "ranking-bg":
      url = `${http}20231205/89fc6064-0f38-438f-a87c-ea0ff2afc2b5/ranking-bg.png`;
      break;
    //热榜
    case "hot-list-index":
      url = `${http}20231205/e5188b3a-52e1-4e7c-b8e0-7780800dd62c/hot-list.png`;
      break;
    //期待榜
    case "lookingForward-list":
      url = `${http}20231205/7d24172b-16e9-4192-b085-66e2e78c33f2/lookingForward-list.png`;
      break;
    //人气总榜
    case "popularity-ranking":
      url = `${http}20231205/830acae3-d517-44fa-937d-7dd3814a0630/popularity-ranking.png`;
      break;
    //口碑榜
    case "wordMouth-list":
      url = `${http}20231205/a40bdefb-9f93-4353-a0c6-d6fe458743ea/wordMouth-list.png`;
      break;
    case "hot-list-discover":
      url = `${http}20231205/10e7b9cf-cf37-4184-985f-4d850885499f/hot-list-discover.png`;
      break;
    case "juyou-share-default":
      url = `${http}20231205/5a4d3570-d499-41a1-9740-c7028a812a94/Group%201041787%403x.png`;
      break;
    case "juyou-dynamic-detail-default":
      url = `${http}20231207/3c5819d7-6073-4f60-9c7d-d0399e676713/Frame%201171276766%403x.png`;
      break;
    case "icon-delete":
      url = `${http}20231211/9bc91f90-ad9d-4cbf-8c76-2503fce44ca8/icon-delete.png`;
      break;
    case "icon-edit":
      url = `${http}20231211/9654f331-c18f-430d-9043-9914fbda2e8b/icon-edit.png`;
      break;
    case "icon-jubao":
      url = `${http}20231211/30cb613c-030a-4941-87c5-27d796ea962e/icon-jubao.png`;
      break;
    case "city-gathering-drama-default":
      url = `${http}20231211/29d199e3-f437-4830-9219-3617aa5c4d34/Frame%201171276754%403x.png`;
      break;
    case "city-gathering-store-default":
      url = `${http}20231211/739826bd-0aba-4dce-b195-f49acf8c0ccb/Frame%201171276754%403x%20%281%29.png`
      break;
    case "city-gathering-gather-default":
      url = `${http}20231211/c2d3ab8e-bbe6-4684-aa11-71ea3b987301/Frame%201171276759%403x.png`;
      break;
    //组局缺省页
    case "GoGatherImg":
      url = `${http}20231211/31b8c207-7596-40ca-a7dc-7f4a7d422552/GoGather.png`;
      break;
    //门店缺省页
    case "storeName":
      url = `${http}20231211/7d84b72a-ecdd-4817-abd7-6717def06b0c/storeName.png`;
      break;
    //动态缺省页
    case "trendsImage":
      url = `${http}20231211/f795c19b-e029-42a2-a520-caea819c0891/trendsImage.png`;
      break;
    //剧本缺省页
    case "dramaImage":
      url = `${http}20231211/8c62e5ba-be45-45e4-9148-199fc61e6ea0/dramaImage.png`;
      break;
    //剧评缺省页
    case "dramatic-criticism":
      url = `${http}20231211/f924ec8d-aef7-4aab-9426-af19296b432d/dramatic-criticism.png`;
      break;
    case "No-comments":
      url = `${http}20231211/e9dad66e-a637-4605-9459-9fbc9e383344/No-comments.png`;
      break;
    case "dynamic-publish-photo":
      url = `${http}20231215/9f42f06b-d061-4c07-a612-b8150287dc4e/Frame%201171276883%403x.png`;
      break;
    case "dynamic-join-close":
      url = `${http}20231215/19634748-802a-4866-a108-37d2173d4b0f/%E9%94%99%E8%AF%AF%201%403x.png`;
      break;
    case "reservation-bg":
      url = `${http}20240118/dab54dc2-1f1e-4630-ada9-23e0b87a8fdb/%E8%A1%A8%E5%8D%95%E8%83%8C%E6%99%AF.png`;
      break;
    case "reservation-logo":
      url = `${http}20240118/7208df21-41f5-4983-8114-b0edd75105db/LPlogo_%E7%94%BB%E6%9D%BF%201%20%E5%89%AF%E6%9C%AC.png`;
      break;
    case "reservation-scanCode":
      url = `${http}20240118/97df3935-e99f-4d02-92b6-ba6967a2ca16/WechatIMG2.png`;
      break;
    case "member-level-bg":
      url = `${http}20240329/6778afc5-4997-42cd-8760-acb00264ebb0/Group%201042518%403x.png`;
      break;
    case "empty-activity":
      url = `${http}20240208/0bfbf983-9821-4f23-a05e-5efc279384c3/empty-activity.png`;
      break;
    case "lp-activity-bg":
      url = `${http}20240208/fde72eff-5a79-4dac-b5c1-9d8c05467cf2/activity-bg.png`;
      break;
    case "lp-book-bg":
      url = `${http}20240308/0577b476-9477-4690-a780-f5e270d49360/Group%201042054%403x%20%281%29.png`;
      break;
    case "lp-activity-border":
      url = `${http}20240329/d45dba59-eea2-490c-b5cf-1b27ea8246dc/Group%201042526%403x.png`;
      break;
    case "pop-book-bg":
      url = `${http}20240226/c3a6225c-3fe1-416e-bc76-7f7e51f169b4/Group%201042089%403x.png`;
      break;
    case "lp-book-success":
      url = `${http}20240228/a930966b-7acd-4ed0-bc48-4787041d3a22/Group%201042083%403x.png`;
      break;
    case "lp-poster-cover-border":
      url = `${http}20240228/5bd53cc0-ea9b-4323-927a-407651134ad1/Rectangle%2013039.png`;
      break;
    case "lp-poster-bg":
      url = `${http}20240229/9836ca59-96f3-435a-b51e-34c8678fea49/Group%201042085%403x%20%281%29.png`;
      break;
    case "invite-poster-bg":
      url = `${http}20240328/48bcff96-39be-4feb-b5cf-7f88a6362696/Group%201042485%403x.png`;
      break;
    case "invite-poster-title":
      url = `${http}20240328/eb34c319-d001-4c25-9b9e-7ed1f8d64ea2/Frame%201171276996%403x.png`;
      break;
    case "lp-share":
      url = `${http}20240329/4a2a00f9-2b0b-4bed-9c77-82770d89def3/lp-share.png`;
      break;
    case "memberShip-cover":
      url = `${http}20240403/8e98b3fd-9b4d-44a3-ba5b-0e1fb8971757/memberShip-cover.png`;
      break;
    case "popMember-bg":
      url = `${http}20240403/e7283588-9463-49b6-8754-0c0d654ff1fa/popMember-bg.png`;
      break;
    case "icon-book-back":
      url = `${http}20240410/a7967151-6e5d-43ec-a738-4da1393c4393/icon-book-back.png`;
      break;
    case "lp-go-answer":
      url = `${http}20240513/59dc0991-dfd5-4b4d-940e-48343b13d0a8/Group%201042489%403x%20%282%29.png`;
      break;
    case "icon-go-buy":
      url = `${http}20240410/b6b51e02-1252-49d4-a884-3cfdbf1e6fc7/icon-go-buy.png`;
      break;
    case "love-match":
      url = `${http}20240422/9c0b4873-c1f3-4b6e-abdc-d62ad2137435/Group%201042567%403x.png`;
      break;
    case "love-game":
      url = `${http}20240422/6842df94-afff-4bbb-8d1b-63afe1456a93/Group%201042566%403x.png`;
      break;
    case "love-openGame":
      url = `${http}20240422/7844405e-e254-42d4-97b5-1f2bd92119fc/Group%201042573%403x.png`;
      break;
    case "love-matchNote":
      url = `${http}20240422/05c8f685-decb-4384-bb03-5578c3633b22/Group%201042574%403x.png`;
      break;
    case "love-answer-bg":
      url = `${http}20240511/11d37085-f0af-405b-b577-f4e461ec604f/3751709884536_.pic%403x.png`;
      break;
    case "match-background":
      url = `${http}20240516/d3c78b82-647c-485b-8c7a-c3100ad6bbfa/match.png`;
      break;
    case "start-upload":
      url = `${http}20240520/9cb6535e-c7fa-4b5c-a49c-8c65151bedb9/start-upload.png`;
      break;
    case "upload-fail":
      url = `${http}20240520/b1074717-a0ea-4d28-af45-efce4eba7c8a/upload-fail.png`;
      break;
    case "icon-uploading":
      url = `${http}20240520/50991701-364a-4d58-8dfd-fd0722519c55/icon-uploading.png`;
      break;
    case "start-match":
      url = `${http}20240520/28ca9143-f49c-479e-a0cd-b899f579325f/start-match.png`;
      break;
    case "icon-mate-invite":
      url = `${http}20240520/54a23cc9-ba2a-47e0-9f42-4115191d3933/icon-invite.png`;
      break;
    case "get-count":
      url = `${http}20240520/4fa581c0-0199-4fab-ac98-c58b0f221ac5/get-count.png`;
      break;
    case "match-record":
      url = `${http}20240520/22bacf6c-d045-47ad-8c9c-933b9bd54e5e/match-record.png`;
      break;
    case "none-note":
      url = `${http}20240520/be845d17-570a-43d4-a09e-5357f15a17d5/none-note.png`;
      break;
    case "match-count-bg":
      url = `${http}20240520/b65e523d-b8e3-4b52-80e6-02d69ce44c00/match-count-bg.png`;
      break;
    case "match-result-bg":
      url = `${http}20240522/942fd0c6-8182-4393-bc96-1529b13636ae/match-result-bg.png`;
      break;
    case "buy-success":
      url = `${http}20240522/1c78976e-b94e-48c9-9b4c-5c80d3f0108a/buy-success.png`;
      break;
    case "none-match":
      url = `${http}20240523/541bb98d-f215-4563-9754-1a8c0fdecc3c/none-match.png`;
      break;
    case "lp-go-match":
      url = `${http}20240528/84f729c8-b6a7-438a-b70b-3cd2a9e22e5c/Group%201042489%403x%20%283%29.png`;
      break;
  }
  return url;
}

module.exports = {
  getIconName,
}; 

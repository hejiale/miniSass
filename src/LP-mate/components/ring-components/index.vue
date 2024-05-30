<template>
  <div class="container">
    <image :src="$iconFont.getIconName('match-background')" mode="aspectFill" />
    <ring1 class="container-ring1" :userList="userList(0, 11)"/>
    <ring2 class="container-ring2" :userList="userList(12, 19)"/>
    <ring3 class="container-ring3" :userList="userList(20, 27)"/>
    <ring4 class="container-ring4" :userList="userList(28, 39)"/>
    <ring5 class="container-ring5" :userList="userList(40, 47)"/>
    <ring6 class="container-ring6" :userList="userList(48, 55)"/>
  </div>
</template>
<script lang="js">
import service from "../../utils/service";
import ring1 from './ring1.vue';
import ring2 from './ring2.vue';
import ring3 from './ring3.vue';
import ring4 from './ring4.vue';
import ring5 from './ring5.vue';
import ring6 from './ring6.vue';

export default {
    components: {
        ring1,
        ring2,
        ring3,
        ring4,
        ring5,
        ring6
    },
    props: {
      LpUserId: {
        type: Number,
        default: null
      }
    },
    data(){
      return {
        matchUsers: []
      }
    },
    watch: {
      LpUserId(){
        this.queryUserList();
      }
    },
    computed: {
      userList(){
        return function(from, to){
          if(!this.matchUsers.length)return [];
          return this.matchUsers.slice(from, to);
        }
      }
    },
    methods:{
      async queryUserList(){
        this.matchUsers = await service.simulateOrbitalMotion({id: this.LpUserId});
      }
    }
}
  
</script>
<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  position: fixed;
  left: 0;
  top: 0;
  &-ring1,
  &-ring2,
  &-ring3 {
    position: absolute;
    top: 11.7vh;
    left: 1vw;
  }
  &-ring4,
  &-ring5,
  &-ring6 {
    position: absolute;
    top: 57.6vh;
    left: -24.2vw;
  }
}
</style>
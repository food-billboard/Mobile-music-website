<template>
    <div class="singerintroduce">
        <div class="isget">
            <mt-spinner :type="3" v-show="!isGet" :size="40"></mt-spinner>
        </div>
        <p class="desc">
            <i>艺人简介:</i> {{introduceText}}
        </p>
    </div>
</template>
<script>
    import {getData} from '@/common/tools.js'
    export default {
        name: "SingerIntroduce",
        created() {
            this.getIntroduce();
        },
        data(){
            return {
                introduceText: '',
                isGet: false,
            }
        },
        methods: {
            getIntroduce() {
                this.isGet = false;
                const url = `${this.$store.state.baseUrl._url}/artist/desc/?id=${this.$route.params.id}`;
                getData(this, url, res => {
                    this.introduceText = res.data.briefDesc;
                    this.isGet = true;
                }, err => {
                    this.$toast({
                        message: '没有更多了',
                        position: 'middle',
                        duration: 2000
                    });
                });
            },
        }
    }
</script>
<style scope>
    .singerintroduce{
        width:100%;
        height:100%;
        padding:.5rem .5rem;
        margin-bottom:1rem;
        box-sizing:border-box;
    }
    .singerintroduce .desc{
        word-break: break-all;
        font-size:.32rem;
    }
</style>
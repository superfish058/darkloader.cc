<template>
    <div class="baseBox">
        <div class="box">
            <div class="top">
                <div class="title">Make A Decision</div>
            </div>
            <div class="center">
                <div class="inputArea">
                    <div class="name">输入抉择项：</div>
                    <el-input type="text" v-model="wordItem" @keyup.enter="saveWord"></el-input>
                </div>
                <div class="words">
                    <div class="word" v-for="item,index in words" :key="index" :class="{active:index==fakeNum}">
                        {{item}}
                    </div>
                </div>
            </div>
            <div class="winner">
                Your Choice Is ：{{finalWord||'等待揭晓'}}
            </div>
            <div class="btn" v-show="words.length>=2">
                <el-button @click="startCount">start!</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                wordItem: '',
                words: [],
                finalNum: -1,
                fakeNum: 0,
                timer: {},
                finalWord: ''

            };
        },
        computed: {
            classArrow() {
                return {
                    'width': '128px',
                    'height': '128px'
                }
            }
        },
        mounted() {

        },
        beforeDestroyed() {
            clearInterval(this.timer)
        },
        components: {
            
        },
        methods: {
            saveWord() {
                if (this.wordItem) {
                    this.words.push(this.wordItem)
                    this.wordItem = ''
                }
            },
            startCount() {
                let count = 0
                this.timer = setInterval(() => {
                    if (count <= 20) {
                        this.lampSwitch(this.words)
                        this.fakeNum = count % (this.words.length)
                    } else {
                        this.fakeNum = count % (this.words.length)
                        if (this.fakeNum == this.finalNum) {
                            clearInterval(this.timer)
                            this.finalWord = this.words[this.finalNum]
                        }
                    }
                    count++
                }, 100)
            },
            lampSwitch(keyArr) {
                let keyNum = keyArr.length
                let finalNum = Math.floor(Math.random() * keyNum)
                this.finalNum = finalNum
            }
        },
    };
</script>

<style scss scoped>
    .baseBox {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        .box{
            width: 400px;
            height: 100%;
        }

        .top {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            margin-bottom: 20px;

            .clearBtn {
                position: absolute;
                left: 0;
            }
            .title{
                font-size:18px;
                font-weight: 700;
            }
        }

        .inputArea {
            display: flex;
            gap: 10px;
             margin-bottom: 20px;
             flex-direction: column;
             align-items: center;

            .name{
                white-space: nowrap;
                align-items: center;
                display: flex;
                font-weight: 700;
            }

            .btns {
                display: flex;
                gap: 10px;
                justify-content: center;
            }
        }

        .winner {
            margin-top: 20px;
            margin-bottom: 15px;
            display: flex;
            justify-content: center;
        }

        .words {
            display: flex;
            gap: 10px;
            justify-content: center;

            .word {
                padding: 3px 4px;
                box-sizing: border-box;
                border: 1px solid gray;
                border-radius: 4px;
                height: 30px;
            }

            .active {
                color: #fff;
                background-color: gray;
                border-color: transparent;
            }
        }

        .btn {
            width: 100%;
            margin-top: 15px;
            display: flex;
            justify-content: center;

            button {
                width: 50px;
                height: 30px;
            }
        }
    }
</style>
<template>
    <div class="upload" v-if="active">
        <el-upload ref="upload" action="#" v-loading="loading"
                   class="upload-panel"
                   element-loading-text="正在读取文件，请耐心等待"
                   element-loading-spinner="el-icon-loading"
                   :limit="1"
                   :drag="true"
                   :multiple="false"
                   :auto-upload="false"
                   :show-file-list="false"
                   :accept="accept"
                   :on-change="fileOnChange">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em style="color: #5F75ED">点击上传</em></div>
        </el-upload>
        <sheetsTable v-show="Object.keys(sheets).length"
                     :fields="fields"
                     :sheets-data="sheets"
                     :on-upload="onUpload"></sheetsTable>
        <div class="no-data" v-if="Object.keys(sheets).length == 0">上传文件以预览数据</div>
    </div>
</template>

<script>
import sheetsTable from '@/components/eUpload/comp/sheetsTable'
import xlsx from 'xlsx'

export default {
    name: 'eUpload',
    props: {
        fields: {
            type: Object,
            default: () => {
            }
        },
        accept: {
            type: String,
            default: () => '.xls,.xlsx'
        },
        onUpload: {
            type: Function,
            default: () => null
        }
    },
    components: {
        sheetsTable
    },
    methods: {
        uid: function () {
            return 'upload' + this['_uid']
        },
        fileOnChange: function (file) {
            this.loading = true
            this.readExcel(file)
            this.$refs.upload.clearFiles()
        },
        readExcel: function (file) {
            setTimeout(() => {
                const reader = new FileReader()

                reader.readAsBinaryString(file.raw)
                reader.onload = ev => {
                    try {
                        this.buildData(
                            xlsx.read(ev.target.result, {
                                type: 'binary'
                            })
                        )
                    } catch (error) {
                        throw error
                    } finally {
                        this.loading = false
                        this.lib.message.alert('数据量较大时，操作会有一定的延时卡顿，属正常现象', '读取成功', null, 'success')
                    }
                }
            }, 500)
        },
        buildData: function (workbook) {
            const sheets = {}
            for (let sheet in workbook.Sheets) {
                sheets[sheet] = xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
            }
            this.$set(this, 'sheets', sheets)
        },
        refresh: function () {
            this.active = false
            this.$set(this, 'sheets', {})
            this.$nextTick(() => this.active = true)
        }
    },
    data () {
        return {
            active: true,
            loading: false,
            sheets: {}
        }
    }
}
</script>

<style>
.upload {
    width: 100%;
}

.upload > .upload-panel {
    width: 100%;
    display: inline-block;
}

.upload .el-upload,
.upload .el-upload-dragger {
    width: 100%;
}

.upload .el-upload-dragger:hover {
    border-color: #5F75ED;
}

.upload .el-loading-spinner i {
    font-size: 30px;
    color: #5F75ED;
}

.upload .el-loading-spinner .el-loading-text {
    color: #5F75ED;
}

.no-data {
    color: #606266;
    font-size: 14px;
    padding-top: 10px;
    text-align: center;
}
</style>

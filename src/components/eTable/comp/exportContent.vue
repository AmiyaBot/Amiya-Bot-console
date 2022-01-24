<template>
    <div class="operations">
        <el-button size="mini" type="primary" plain
                   :disabled="!exportPageUrl"
                   @click="exportData(true)">导出当前页
        </el-button>
        <el-button size="mini" type="danger"
                   plain :disabled="!exportAllUrl"
                   @click="exportData(false)">导出全部
        </el-button>
    </div>
</template>

<script>
export default {
    name: 'exportContent',
    props: [
        'exportPageUrl',
        'exportAllUrl',
        'currPage',
        'currPageSize',
        'getValue'
    ],
    methods: {
        exportData: function (exportPage) {
            const search = this.getValue()

            if (exportPage) {
                search.pageNum = this.currPage
                search.pageSize = this.currPageSize
            }

            this.etao.requests.export(
                {
                    url: exportPage ? this.exportPageUrl : this.exportAllUrl,
                    data: search
                },
                undefined,
                'xlsx'
            )
        }
    }
}
</script>

<style scoped>
</style>

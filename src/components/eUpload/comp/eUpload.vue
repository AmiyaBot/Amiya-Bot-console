<template>
    <div class="upload">
        <input ref="file" type="file" :accept="accept">
    </div>
</template>

<script>
export default {
    name: 'eUpload',
    props: {
        url: String,
        accept: {
            type: String,
            default: () => '.png,.jpg'
        },
        onUpload: {
            type: Function,
            default: () => null
        }
    },
    methods: {
        upload: function (mark, filename) {
            this.mark = mark
            this.filename = filename
            this.$refs.file.click()
        }
    },
    data () {
        return {
            mark: null,
            filename: null
        }
    },
    mounted () {
        this.$refs.file.addEventListener('change', e => {
            const files = e.target.files
            const filename = this.filename

            if (files.length) {
                const file = files[0]
                this.lib.requests.upload(this.url, file, filename || file.name, res => {
                    this.onUpload(this.mark, res.filename)
                })
            }
            this.$refs.file.value = ''
        })
    }
}
</script>

<style>
.upload {
    display: none;
}
</style>

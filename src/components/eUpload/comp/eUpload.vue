<template>
    <div class="upload">
        <input ref="file" type="file" :accept="accept">
    </div>
</template>

<script>
export default {
    name: 'eUpload',
    props: {
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
            if (files.length) {
                const file = files[0]
                this.lib.requests.upload(file, this.filename, res => {
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

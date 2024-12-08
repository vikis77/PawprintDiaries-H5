import { defineConfig } from "vite"
import uni from "@dcloudio/vite-plugin-uni"
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        uni(),
        AutoImport({
            imports: [
                'vue',
                'uni-app'
            ]
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    }
})


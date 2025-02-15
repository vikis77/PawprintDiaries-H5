import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from 'unplugin-auto-import/vite';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

// 获取 API 文件导出
const getApiImports = () => {
    const apiPath = resolve(__dirname, 'src/api');
    const files = fs.readdirSync(apiPath).filter(file => file.endsWith('.js'));
    const imports = {};
    
    files.forEach(file => {
        const name = path.basename(file, '.js');
        imports[name] = `@/api/${name}`;
    });
    
    return imports;
};

export default defineConfig({
    plugins: [
        uni(),
        AutoImport({
            imports: [
                'vue',
                'uni-app',
                'pinia',
                {
                    '@/store/modules/app': ['useAppStore']
                }
            ],
            dirs: [
                'src/api',
                'src/utils',
                'src/store'
            ],
            dts: 'src/auto-imports.d.ts',
            eslintrc: {
                enabled: true
            }
        })
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    base: '/', // 确保所有静态资源以根路径/开头

    server: {
        proxy: {
            '/SL/': {
                target: 'http://localhost:8080',  // 后端服务器地址
                changeOrigin: true,  // 允许跨域
                rewrite: (path) => path.replace(/^\/SL\//, '/api/shotLinkShare/getOriginLink?shortLink=')  // 重写路径
            }
        }
    }
});

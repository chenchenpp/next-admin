## 技术栈
前端：[Next.js](https://nextjs.org/) + React + antd + [tailwindcss](https://www.tailwindcss.cn/docs/preflight)
后端：Express + xlsx-style + xlsx-js-style + mongodb

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 坑点
1. tailwindcss与antd冲突
   
   tailwindcss默认配置@tailwind base，与antd样式冲突，使用tailwind.config配置：
   ```javascript
   module.exports = {
        corePlugins: {
            preflight: false
        }
    }
   ```
   这个配置相当于把@tailwind base的默认样式屏蔽掉，从源码中找到node_modules/tailwindcss/lib/css/preflight.css文件，会发现还初始化了其他标签的默认样式，所以综上解决：先配置属性屏蔽base使用，将preflight文件拿出来配置到样式中。
2. Parsing error : Cannot find module 'next/babel':
  解决方式：https://stackoverflow.com/questions/68163385/parsing-error-cannot-find-module-next-babel
## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

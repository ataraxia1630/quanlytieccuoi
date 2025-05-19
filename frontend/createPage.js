// createPage.js
const fs = require('fs');
const path = require('path');

const name = process.argv[2];

if (!name) {
  console.error('Bạn phải nhập tên page. Ví dụ: node createPage.js Home');
  process.exit(1);
}

const dir = `./src/app/pages/${name}`;
if (fs.existsSync(dir)) {
  console.error(' Page đã tồn tại');
  process.exit(1);
}

fs.mkdirSync(dir);

fs.writeFileSync(`${dir}/${name}.js`, 
`import React from 'react';
import './${name}.css';

function ${name}() {
  return (
    <div className="${name.toLowerCase()}-page">
      <h1>${name} Page</h1>
    </div>
  );
}

export default ${name};
`);

fs.writeFileSync(`${dir}/index.js`, 
`import ${name} from './${name}';
    
export default ${name};
`);
fs.writeFileSync(`${dir}/${name}.css`, `/* CSS cho ${name} */`);

console.log(` Đã tạo page ${name} tại ${dir}`);

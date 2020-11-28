require('dotenv').config()
const fs = require('fs')

const text = `<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.GA}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.GA}');
</script>`

fs.writeFileSync('./src/_ga.ejs', text)

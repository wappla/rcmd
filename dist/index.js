import i from"arg";function p(s){let e=new URL(s).searchParams.get("argv"),r=[];return e!==null&&(r=e.split(" ")),r}async function g(s,e,r){if(s.headers.get("authorization")!==`Bearer ${process.env.RCMD_SECRET}`)return{status:401,body:{success:!1}};try{let t=p(s.url),{args:o,options:a}=e(t);return{status:200,body:{success:!0,result:await r(...o,a)}}}catch(t){return{status:500,body:{success:!1,error:t}}}}function l(s,e){let r=i(e,{permissive:!1,argv:s.slice(3)}),{_:n,...t}=r,o=Object.entries(t).reduce((a,[u,c])=>(a[u.replace("--","")]=c,a),{});return{args:n,options:o}}async function m(s,e,r){return g(s,n=>l(n,e),r)}export{l as parseArgv,m as parseCmdReq,p as parseCmdUrl,g as processCmdReq};
//# sourceMappingURL=index.js.map
#!/usr/bin/env node
import{cosmiconfig as u}from"cosmiconfig";async function v(n){let e=await u("rcmd").search();if(e===null)throw Error("No rcmd config found");let{config:t}=e,{envs:c,basePath:i}=t,s=Object.keys(c).map(o=>`--${o}`),[r]=n.filter(o=>s.includes(o));if(!r)throw Error("No env option specified");let a=r.replace("--",""),f=t.envs[a],l=n.filter(o=>!s.includes(o)),p=n[2],g=await(await fetch(`${f}/${i}/${p}?argv=${l.join(" ")}`,{headers:{authorization:`Bearer ${process.env.RCMD_SECRET}`}})).json()}v(process.argv);export{v as main};
//# sourceMappingURL=cli.js.map
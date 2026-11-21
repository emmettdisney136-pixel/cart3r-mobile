(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const defaults = {theme:"crimson", accent:null, plugins:{markdown:true,timestamp:true,color:true,snippets:false,quicklinks:true}, snippets:[], reducedMotion:false};
  let state;
  try { state = {...defaults,...JSON.parse(localStorage.getItem("cart3r-state")||"{}")}; } catch { state={...defaults}; }
  state.plugins = {...defaults.plugins,...(state.plugins||{})};
  const save = () => { try { localStorage.setItem("cart3r-state",JSON.stringify(state)); } catch {} updateHome(); };
  const toast = msg => { const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove("show"),1900); };
  const themes={crimson:"#ff304f",midnight:"#9a7bff",ocean:"#27b9ed",emerald:"#30d69a"};
  function applyTheme(){document.documentElement.style.setProperty("--accent",state.accent||themes[state.theme]||themes.crimson);$$(".theme-option").forEach(b=>b.classList.toggle("selected",b.dataset.theme===state.theme&&!state.accent));$("#accentPicker").value=state.accent||themes[state.theme]||themes.crimson;$("#accentHex").value=state.accent||themes[state.theme]||themes.crimson;save();}
  function updateHome(){$("#homeTheme").textContent=state.accent?"Custom":state.theme[0].toUpperCase()+state.theme.slice(1);$("#homePlugins").textContent=Object.values(state.plugins).filter(Boolean).length;}
  function navigate(page){$$(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));$$(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));$("#sidebar").classList.remove("open");$("#main").focus({preventScroll:true});window.scrollTo({top:0,behavior:state.reducedMotion?"instant":"smooth"});}
  $$(".nav").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.page)));
  $$("[data-page='home']").forEach(b=>b.addEventListener("click",()=>navigate("home")));
  $$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
  $("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  $$(".theme-option").forEach(b=>b.addEventListener("click",()=>{state.theme=b.dataset.theme;state.accent=null;applyTheme();toast("Theme applied");}));
  $("#accentPicker").addEventListener("input",e=>$("#accentHex").value=e.target.value.toUpperCase());
  $("#applyAccent").addEventListener("click",()=>{const v=$("#accentHex").value.trim();if(!/^#[0-9a-fA-F]{6}$/.test(v)){toast("Enter a valid hex color");return;}state.accent=v;applyTheme();toast("Custom accent applied");});
  const pluginData=[
    ["markdown","M","Markdown preview","Preview common Discord markdown formatting in the toolbox."],
    ["timestamp","◷","Timestamp generator","Convert a local date and time into Discord timestamp syntax."],
    ["color","◈","Hex color helper","Pick and copy hex color values."],
    ["snippets","▤","Local snippets","Save reusable text locally on this device."],
    ["quicklinks","↗","Quick links","Keep official Discord and support links in the About page."]
  ];
  function renderPlugins(){$("#pluginList").innerHTML=pluginData.map(([id,icon,name,desc])=>`<div class="plugin-card"><div class="plugin-icon">${icon}</div><div class="plugin-info"><b>${name}</b><p>${desc}</p></div><label class="switch"><input type="checkbox" data-plugin="${id}" ${state.plugins[id]?"checked":""}><span></span></label></div>`).join("");$$("[data-plugin]").forEach(c=>c.addEventListener("change",()=>{state.plugins[c.dataset.plugin]=c.checked;save();toast(c.checked?"Plugin enabled":"Plugin disabled");}));}
  $$(".tool-tab").forEach(b=>b.addEventListener("click",()=>{$$(".tool-tab").forEach(x=>x.classList.toggle("active",x===b));$$(".tool-panel").forEach(x=>x.classList.toggle("hidden",x.id!=="tool-"+b.dataset.tool));}));
  function escapeHtml(s){return s.replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
  function markdown(s){let x=escapeHtml(s);x=x.replace(/```([\s\S]*?)```/g,"<code>$1</code>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>").replace(/~~(.+?)~~/g,"<s>$1</s>").replace(/^&gt; (.*)$/gm,"│ $1");return x;}
  $("#mdInput").addEventListener("input",e=>$("#mdPreview").innerHTML=markdown(e.target.value)||"Your preview appears here…");
  $("#copyMarkdown").addEventListener("click",()=>copy($("#mdInput").value));
  $("#dateInput").addEventListener("input",e=>{if(!e.target.value)return;const unix=Math.floor(new Date(e.target.value).getTime()/1000);$("#timestampResult").textContent=`<t:${unix}:F>`;});
  $("#copyTimestamp").addEventListener("click",()=>copy($("#timestampResult").textContent));
  $("#toolColor").addEventListener("input",e=>{$("#toolHex").textContent=e.target.value.toUpperCase();$("#colorSample").style.background=e.target.value;});
  $("#copyColor").addEventListener("click",()=>copy($("#toolHex").textContent));
  function copy(text){if(!text)return; if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(()=>toast("Copied to clipboard")).catch(()=>fallbackCopy(text));else fallbackCopy(text);}
  function fallbackCopy(text){const el=document.createElement("textarea");el.value=text;document.body.append(el);el.select();try{document.execCommand("copy");toast("Copied");}catch{toast("Copy unavailable");}el.remove();}
  function renderSnippets(){$("#snippetList").innerHTML=state.snippets.map((s,i)=>`<div class="snippet"><span>${escapeHtml(s).replace(/\n/g," ")}</span><button data-delete="${i}">DELETE</button></div>`).join("")||'<p class="hint">No snippets saved yet.</p>';$$("[data-delete]").forEach(b=>b.addEventListener("click",()=>{state.snippets.splice(+b.dataset.delete,1);save();renderSnippets();}));}
  $("#saveSnippet").addEventListener("click",()=>{const v=$("#snippetInput").value.trim();if(!v){toast("Enter some text first");return;}state.snippets.unshift(v);$("#snippetInput").value="";save();renderSnippets();toast("Snippet saved locally");});
  $("#reducedMotion").checked=!!state.reducedMotion;$("#reducedMotion").addEventListener("change",e=>{state.reducedMotion=e.target.checked;document.body.classList.toggle("reduced-motion",e.target.checked);save();});
  $("#resetApp").addEventListener("click",()=>{if(!confirm("Reset all CART3R MOBILE settings and local snippets on this device?"))return;state={...defaults,plugins:{...defaults.plugins},snippets:[]};save();applyTheme();renderPlugins();renderSnippets();$("#reducedMotion").checked=false;toast("Workspace reset");});
  if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  applyTheme();renderPlugins();renderSnippets();updateHome();
})();
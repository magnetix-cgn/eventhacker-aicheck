const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

function start(){
 const html=fs.readFileSync(path.join(__dirname,"..","index.html"),"utf8");
 const match=html.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(match,"inline game script present");
 class Element{
  constructor(tag){this.tag=tag;this.value="";this.textContent="";this.hidden=false;this.children=[];this.handlers={};this.style={};this.attrs={};this.classList={toggle:()=>{}};}
  append(...items){this.children.push(...items);}
  replaceChildren(...items){this.children=[...items];}
  addEventListener(name,handler){this.handlers[name]=handler;}
  setAttribute(key,val){this.attrs[key]=val;}
  focus(){}
  scrollIntoView(){}
 }
 const els={},storage={};
 const document={getElementById:id=>els[id]||(els[id]=new Element(id)),createElement:tag=>new Element(tag)};
 const localStorage={getItem:key=>storage[key]||null,setItem:(key,val)=>{storage[key]=val;},removeItem:key=>{delete storage[key];}};
 vm.runInNewContext(match[1],{document,localStorage,confirm:()=>true});
 function click(id){assert.ok(els[id].handlers.click,id+" click handler");els[id].handlers.click();}
 function resultTitle(id){const h=els[id].children.find(c=>c.tag==="h3");return h&&h.textContent;}
 function switchTo(id){els.select.value=id;els.select.handlers.change({target:els.select});}
 return{els,storage,click,resultTitle,switchTo};
}
test("six complete missions and saved flight log",()=>{
 const {els,storage,click,resultTitle}=start();
 assert.equal(els.select.children.length,6);
 for(let i=0;i<6;i++){
  els.request.value=els.exampleText.textContent;click("checkM");
  assert.equal(resultTitle("resultM"),"✓ Flightcheck bestanden","mission index "+i);
  click("next");
 }
 assert.equal(els.completed.textContent,"6 / 6");
 const saved=Object.values(storage)[0];
 assert.ok(saved);
 assert.doesNotMatch(saved,/Request ID:/,"request texts must not persist");
});
test("Stage 2 missing deployment boundary is not cleared",()=>{
 const {els,click,resultTitle,switchTo}=start();
 switchTo("stage2");els.request.value="Stage 2: Implementiere eventhacker-aicheck und führe Tests aus.";
 click("checkM");assert.equal(resultTitle("resultM"),"Noch nicht cleared");
});
test("release signal alone cannot authorize deployment",()=>{
 const {els,click,resultTitle,switchTo}=start();
 switchTo("takeoff");els.request.value="Ready for takeoff";click("checkM");
 assert.equal(resultTitle("resultM"),"Noch nicht cleared");
});
test("abort signal alone is insufficient",()=>{
 const {els,click,resultTitle,switchTo}=start();
 switchTo("abort");els.request.value="Abort!";click("checkM");
 assert.equal(resultTitle("resultM"),"Noch nicht cleared");
});
test("free request trainer, template and reset work",()=>{
 const {els,click}=start();click("modeF");click("template");
 assert.match(els.freeText.value,/Freigabe/);
 els.freeText.value="Bitte erstelle einen Artikel. Phase: Stage 1. Kontext: Eventhacker. Abnahme: Tests. Nur Entwurf, nicht veröffentlichen. Request ID: 1.";
 click("checkF");assert.equal(els.resultF.hidden,false);
 click("reset");assert.equal(els.completed.textContent,"0 / 6");
});

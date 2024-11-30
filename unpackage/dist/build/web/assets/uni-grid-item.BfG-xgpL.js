import{o as e,a as t,w as i,j as r,d as s,b as d,f as a,t as o,e as l,n,B as c,g as h,i as u,c as g}from"./index-CFSraVz9.js";import{_}from"./_plugin-vue_export-helper.BCo6x5W8.js";/* empty css                                                                      */const p=_({name:"UniCard",emits:["click"],props:{title:{type:String,default:""},subTitle:{type:String,default:""},padding:{type:String,default:"10px"},margin:{type:String,default:"15px"},spacing:{type:String,default:"0 10px"},extra:{type:String,default:""},cover:{type:String,default:""},thumbnail:{type:String,default:""},isFull:{type:Boolean,default:!1},isShadow:{type:Boolean,default:!0},shadow:{type:String,default:"0px 0px 3px 1px rgba(0, 0, 0, 0.08)"},border:{type:Boolean,default:!0}},methods:{onClick(e){this.$emit("click",e)}}},[["render",function(g,_,p,f,m,b){const y=c,x=h,w=u;return e(),t(x,{class:n(["uni-card",{"uni-card--full":p.isFull,"uni-card--shadow":p.isShadow,"uni-card--border":p.border}]),style:l({margin:p.isFull?0:p.margin,padding:p.spacing,"box-shadow":p.isShadow?p.shadow:""})},{default:i((()=>[r(g.$slots,"cover",{},(()=>[p.cover?(e(),t(x,{key:0,class:"uni-card__cover"},{default:i((()=>[s(y,{class:"uni-card__cover-image",mode:"widthFix",onClick:_[0]||(_[0]=e=>b.onClick("cover")),src:p.cover},null,8,["src"])])),_:1})):d("",!0)]),!0),r(g.$slots,"title",{},(()=>[p.title||p.extra?(e(),t(x,{key:0,class:"uni-card__header"},{default:i((()=>[s(x,{class:"uni-card__header-box",onClick:_[1]||(_[1]=e=>b.onClick("title"))},{default:i((()=>[p.thumbnail?(e(),t(x,{key:0,class:"uni-card__header-avatar"},{default:i((()=>[s(y,{class:"uni-card__header-avatar-image",src:p.thumbnail,mode:"aspectFit"},null,8,["src"])])),_:1})):d("",!0),s(x,{class:"uni-card__header-content"},{default:i((()=>[s(w,{class:"uni-card__header-content-title uni-ellipsis"},{default:i((()=>[a(o(p.title),1)])),_:1}),p.title&&p.subTitle?(e(),t(w,{key:0,class:"uni-card__header-content-subtitle uni-ellipsis"},{default:i((()=>[a(o(p.subTitle),1)])),_:1})):d("",!0)])),_:1})])),_:1}),s(x,{class:"uni-card__header-extra",onClick:_[2]||(_[2]=e=>b.onClick("extra"))},{default:i((()=>[s(w,{class:"uni-card__header-extra-text"},{default:i((()=>[a(o(p.extra),1)])),_:1})])),_:1})])),_:1})):d("",!0)]),!0),s(x,{class:"uni-card__content",style:l({padding:p.padding}),onClick:_[3]||(_[3]=e=>b.onClick("content"))},{default:i((()=>[r(g.$slots,"default",{},void 0,!0)])),_:3},8,["style"]),s(x,{class:"uni-card__actions",onClick:_[4]||(_[4]=e=>b.onClick("actions"))},{default:i((()=>[r(g.$slots,"actions",{},void 0,!0)])),_:3})])),_:3},8,["class","style"])}],["__scopeId","data-v-a25085bf"]]);const f=_({name:"UniGrid",emits:["change"],props:{column:{type:Number,default:3},showBorder:{type:Boolean,default:!0},borderColor:{type:String,default:"#D2D2D2"},square:{type:Boolean,default:!0},highlight:{type:Boolean,default:!0}},provide(){return{grid:this}},data:()=>({elId:`Uni_${Math.ceil(1e6*Math.random()).toString(36)}`,width:0}),created(){this.children=[]},mounted(){this.$nextTick((()=>{this.init()}))},methods:{init(){setTimeout((()=>{this._getSize((e=>{this.children.forEach(((t,i)=>{t.width=e}))}))}),50)},change(e){this.$emit("change",e)},_getSize(e){g().in(this).select(`#${this.elId}`).boundingClientRect().exec((t=>{this.width=parseInt((t[0].width-1)/this.column)+"px",e(this.width)}))}}},[["render",function(d,a,o,c,u,g){const _=h;return e(),t(_,{class:"uni-grid-wrap"},{default:i((()=>[s(_,{id:u.elId,ref:"uni-grid",class:n(["uni-grid",{"uni-grid--border":o.showBorder}]),style:l({"border-left-color":o.borderColor})},{default:i((()=>[r(d.$slots,"default",{},void 0,!0)])),_:3},8,["id","class","style"])])),_:3})}],["__scopeId","data-v-9604b287"]]);const m=_({name:"UniGridItem",inject:["grid"],props:{index:{type:Number,default:0}},data:()=>({column:0,showBorder:!0,square:!0,highlight:!0,left:0,top:0,openNum:2,width:0,borderColor:"#e5e5e5"}),created(){this.column=this.grid.column,this.showBorder=this.grid.showBorder,this.square=this.grid.square,this.highlight=this.grid.highlight,this.top=0===this.hor?this.grid.hor:this.hor,this.left=0===this.ver?this.grid.ver:this.ver,this.borderColor=this.grid.borderColor,this.grid.children.push(this),this.width=this.grid.width},beforeDestroy(){this.grid.children.forEach(((e,t)=>{e===this&&this.grid.children.splice(t,1)}))},methods:{_onClick(){this.grid.change({detail:{index:this.index}})}}},[["render",function(a,o,c,u,g,_){const p=h;return g.width?(e(),t(p,{key:0,style:l("width:"+g.width+";"+(g.square?"height:"+g.width:"")),class:"uni-grid-item"},{default:i((()=>[s(p,{class:n([{"uni-grid-item--border":g.showBorder,"uni-grid-item--border-top":g.showBorder&&c.index<g.column,"uni-highlight":g.highlight},"uni-grid-item__box"]),style:l({"border-right-color":g.borderColor,"border-bottom-color":g.borderColor,"border-top-color":g.borderColor}),onClick:_._onClick},{default:i((()=>[r(a.$slots,"default",{},void 0,!0)])),_:3},8,["class","style","onClick"])])),_:3},8,["style"])):d("",!0)}],["__scopeId","data-v-e2fd0340"]]);export{f as a,m as b,p as u};

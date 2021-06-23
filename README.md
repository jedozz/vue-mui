# vue-mui-controls
vue2.6 + mui3.7.2  封装控件
<p>lib/mui.picker.all.yjmodify.js 修改了mui.picker.all.js文件，使其兼容vue</p>
<p>------------------------</p>
<br/>
<p>components/actionSheet.vue 封装了mui的action sheet</p>
<p>------------------------</p>
<br/>
<p>components/header.vue 封装了mui的header</p>
<p>------------------------</p>
<br/>
<p>components/imageBox.vue 多图片容器,用于展示，添加，删除图片</p>
<p>依赖mui.previewimage.js,mui.zoom.js,mui.imageviewer.css</p>
<p>组件属性：</p>
<p>images，数组，存放图片的路径，数组中数据的格式{ path: 图片路径string, isNew: 是否通过新增按钮添加的图片true/false }</p>
<p>max，整数，图片最大数量</p>
<p>disableEdit，是否允许添加删除图片</p>
<p>------------------------</p>
<br/>
<p>components/picker.vue 封装mui的picker</p>
<p>依赖lib/mui.picker.all.yjmodify.js,js/yj.dateFormat.js</p>
<p>------------------------</p>
<br/>
<p>components/paging.vue 分页</p>
<p>依赖</p>
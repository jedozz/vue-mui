# vue-mui-controls
vue2.6 + mui3.7.2  封装控件
<h2>lib/mui.picker.all.yjmodify.js 修改了mui.picker.all.js文件，使其兼容vue</h2>
<br/>
<h2>components/actionSheet.vue 封装了mui的action sheet</h2>
<br/>
<h2>components/header.vue 封装了mui的header</h2>
<br/>
<h2>components/imageBox.vue 多图片容器,用于展示，添加，删除图片</h2>
<p>依赖mui.previewimage.js,mui.zoom.js,mui.imageviewer.css</p>
<p>组件属性：</p>
<p>images，数组，存放图片的路径，数组中数据的格式{ path: 图片路径string, isNew: 是否通过新增按钮添加的图片true/false }</p>
<p>max，整数，图片最大数量</p>
<p>disableEdit，是否允许添加删除图片</p>
<br/>
<h2>components/number.vue 带动画的数字</h2>
<p>依赖@tweenjs/tween.js</p>
<p>组件属性：</p>
<p>number，数字</p>
<p>duration，动画时间</p>
<p>precision，精度，显示到小数点后几位</p>
<p>cut，剪切，格式 { start: 0, end: 9999 }</p>
<p>cutDirection，剪切方向，"toLeft"，"toRight"，默认"toLeft"</p>
<br/>
<h2>components/picker.vue 封装mui的picker</h2>
<p>依赖lib/mui.picker.all.yjmodify.js,js/yj.dateFormat.js</p>
<br/>
<h2>components/paging.vue 分页</h2>
<p>依赖components/picker.vue,components/rollnumbers.vue</p>
<p>组件属性：</p>
<p>page，支持sync</p>
<p>data，数据集</p>
<p>pageSize，页大小</p>
<p>事件：</p>
<p>changed，返回数据格式{ page: 当前页, pagingData：当前页数据 }</p>
<br/>
<h2>components/rollnumber.vue 滚动数字</h2>
<p>依赖jquery.easing</p>
<p>组件属性：</p>
<p>number，数字0-9</p>
<p>speed，滚动速度，大于0，可以带小数点，默认为1，数值越大越慢</p>
<p>initNumberRoll，初始化的数值是否滚动，类型bool</p>
<br/>
<h2>components/rollnumbers.vue 多个滚动数字</h2>
<p>依赖components/rollnumber.vue</p>
<p>组件属性：</p>
<p>number，总的数字，如果数字的位数大于count，超出的高位不显示</p>
<p>count，滚动的数字个数</p>
<p>speed，滚动速度，大于0，可以带小数点，默认为1，数值越大越慢</p>
<p>initNumberRoll，初始化的数值是否滚动，类型bool</p>
<br/>
<h2>components/scroll.vue 区域滚动，带下拉刷新功能</h2>
<p>依赖mui.pullToRefresh.js，mui.pullToRefresh.material.js</p>
<p>组件属性：</p>
<p>enablePulldown，是否开启下拉刷新的功能，类型bool</p>
<p>pulling，刷新中，类型bool，支持sync</p>
<p>pulldownTimeout，下拉超时时间，类型number</p>
<br/>
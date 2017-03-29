<template>
<div class="widget">
	<div class="widget-header">
		<h3>{{title}}</h3>
	</div>
	<div class="widget-content">
		<slot name="chart"></slot>
	</div>
</div>
</template>

<script>
    export default {
        props:{
            title: { //要显示的文字
                type: String,
                required: true,
            }
        }
    }
</script>
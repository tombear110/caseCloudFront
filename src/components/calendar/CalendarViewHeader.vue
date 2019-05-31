<template>
	<div class="cv-header">
		<!--<div class="cv-header-nav">-->
		<!--<button-->
		<!--:disabled="!headerProps.previousYear"-->
		<!--class="previousYear"-->
		<!--@click.prevent="onInput(headerProps.previousYear)"-->
		<!--&gt;-->
		<!--&lt;&lt;-->
		<!--</button>-->
		<!--<button-->
		<!--:disabled="!headerProps.previousPeriod"-->
		<!--class="previousPeriod"-->
		<!--@click.prevent="onInput(headerProps.previousPeriod)"-->
		<!--&gt;-->
		<!--&lt;-->
		<!--</button>-->
		<!--<button-->
		<!--class="currentPeriod"-->
		<!--@click.prevent="onInput(headerProps.currentPeriod)"-->
		<!--&gt;-->
		<!--{{ headerProps.currentPeriodLabel }}-->
		<!--</button>-->
		<!--<button-->
		<!--:disabled="!headerProps.nextPeriod"-->
		<!--class="nextPeriod"-->
		<!--@click.prevent="onInput(headerProps.nextPeriod)"-->
		<!--&gt;-->
		<!--&gt;-->
		<!--</button>-->
		<!--<button-->
		<!--:disabled="!headerProps.nextYear"-->
		<!--class="nextYear"-->
		<!--@click.prevent="onInput(headerProps.nextYear)"-->
		<!--&gt;-->
		<!--&gt;&gt;-->
		<!--</button>-->
		<!--</div>-->
		<div class="periodLabel">
			<!--<slot name="label">{{ headerProps.periodLabel }}</slot>-->
			<slot name="label">
				<i class="iconfont icon-triangle-left" @click.prevent="onInput(headerProps.previousPeriod)"/>
				<span>{{ headerProps.periodLabel }}</span>
				<i class="iconfont icon-triangle-right" @click.prevent="onInput(headerProps.nextPeriod)"/>
			</slot>
		</div>
	</div>
</template>
<script>
    export default {
        name: 'CalendarViewHeader',
        props: {
            headerProps: {
                type: Object,
                required: true
            }
        },
        create(){
        },
        methods: {
            onInput (d) {
                this.$emit('input', d)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .cv-header {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 70px;
        .periodLabel {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
                display: inline-block;
                font-size: 18px;
                font-weight: 600;
                padding: 0 20px;
                color: #333;
            }
            i {
                display: inline-block;
                padding: 0 10px;
                font-size: 12px;
                color: #9FA5B9;
                cursor: pointer;
            }

        }
    }

</style>

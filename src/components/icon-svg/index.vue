<template>
    <svg class="svg-icon" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
<!--    也可直接使用-->
<!--    <svg class="icon" aria-hidden="true">-->
<!--        <use :xlink:href="`#${chartsData.icon}`"></use>-->
<!--    </svg>-->
</template>

<script>
    export default {
        name: 'icon-svg',
        props: {
            name: {
                type: String,
                required: true
            }
        },
        computed: {
            iconName() {
                return `#${this.name}`
            },

        }
    }
</script>

<style>
    .svg-icon {
        width: 1em;
        height: 1em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>


import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class SkinMixin extends Vue {
    setTitleXmasClassName () {
        const list = Array.from(document.querySelectorAll('.skin-title > .title-xmas-2020'))
        if (list.length) {
            for (const [index, item] of list.entries()) {
                if (index % 3 === 0) {
                    item.classList.add('title-xmas-2020-man')
                } else if (index % 3 === 1) {
                    item.classList.add('title-xmas-2020-deer')
                } else if (index % 3 === 2) {
                    item.classList.add('title-xmas-2020-penguin')
                }
            }
        }
    }

    setTitleCampusSupplyClassName () {
        const list = Array.from(document.querySelectorAll('.skin-title > .title-campus-supply'))
        if (list.length) {
            for (const [index, item] of list.entries()) {
                if (index % 3 === 0) {
                    item.classList.add('title-campus-supply-1')
                } else if (index % 3 === 1) {
                    item.classList.add('title-campus-supply-2')
                } else if (index % 3 === 2) {
                    item.classList.add('title-campus-supply-3')
                }
            }
        }
    }
}

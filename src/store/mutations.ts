export default {
    WATCH_CHILD_ROUTER: (state: DynamicObject, childRoute: DynamicObject) => {
        state.childRoute = childRoute
    },
    // 修改 navBarName
    changeNavBarName: (state: DynamicObject, navBarName: string) => {
        state.navBarName = navBarName
    }
}

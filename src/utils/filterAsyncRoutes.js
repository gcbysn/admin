/* 
    该函数作用：通过存有所有路由名称的数组+存有所有路由详情的数组，过滤
    没有出现过的路由对象，存有所有路由详情的数组：asyncRoutes
    存有所有路由名称的数组（权限路由数组）:routeNames

*/
export default function filterAsyncRoutes(asyncRoutes,routeNames){
    // console.log(asyncRoutes,routeNames);
    const newRoutes = asyncRoutes.filter((routeObj)=>{
        // 判断当前路由对象的名称,是否出现在用户的权限路由数组中
        if(routeNames.includes(routeObj.name)){
            // console.log(routeObj);
            if(routeObj.children && routeObj.children.length){
                // console.log(routeObj.children,routeNames);
                filterAsyncRoutes(routeObj.children,routeNames)
            }
            return routeObj;
        }
    })

    return newRoutes
}
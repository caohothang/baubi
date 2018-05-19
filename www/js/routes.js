bibauapp.config(function ($routeProvider, $locationProvider) {
    $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'pages/introduction.html',
            controller: 'introController'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'
        })
        .when('/nhomsanpham', {
            templateUrl: 'pages/nhomsanpham.html',
            controller: 'nhomsanphamController'
        })
        .when('/sanpham/:id', {
            templateUrl: 'pages/sanpham.html',
            controller: 'sanphamController'
        })
        .when('/chitietsanpham/:id', {
            templateUrl: 'pages/chitietsanpham.html',
            controller: 'chitietsanphamController'
        })
        .when('/tintuc', {
            templateUrl: 'pages/tintuc.html',
            controller: 'tintucController'
        })
        .when('/chitiettintuc/:id', {
            templateUrl: 'pages/chitiettintuc.html',
            controller: 'chitiettintucController'
        })
        .when('/account', {
            templateUrl: 'pages/account.html',
            controller: 'accountController'
        })
        .when('/sanphamwishlist', {
            templateUrl: 'pages/sanphamwishlist.html',
            controller: 'sanphamwishlistController'
        })
        .when('/chitietsanphamwishlist/:id', {
            templateUrl: 'pages/chitietsanphamwishlist.html',
            controller: 'chitietsanphamwishlistController'
        })
        .when('/information', {
            templateUrl: 'pages/information.html',
            controller: 'informationController'
        })
        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'registerController'
        })
        .when('/chat', {
            templateUrl: 'pages/chat.html',
            controller: 'chat'
        })
        .when('/point', {
            templateUrl: 'pages/point.html',
            controller: 'pointController'
        })
        .when('/search', {
            templateUrl: 'pages/search.html',
            controller: 'searchController'
        })
        .when('/chitietsanphamsearch/:id', {
            templateUrl: 'pages/chitietsanphamsearch.html',
            controller: 'chitietsanphamsearchController'
        })
});   
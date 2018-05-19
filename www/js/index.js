//create our angularjs app
var bibauapp = angular.module('bibauapp', ['ngRoute', 'ngTouch', 'ngCookies', 'ngDialog', 'socialLogin', 'angularLazyImg']);
bibauapp.config(function(socialProvider, lazyImgConfigProvider){
	//socialProvider.setGoogleKey("YOUR GOOGLE CLIENT ID");
  //socialProvider.setLinkedInKey("YOUR LINKEDIN CLIENT ID");
  socialProvider.setFbKey({appId: "1125067330874610", apiVersion: "v3.0"});
  var scrollable = document.querySelector('#scrollable');
 lazyImgConfigProvider.setOptions({
   offset: 100, // how early you want to load image (default = 100)
   errorClass: 'error', // in case of loading image failure what class should be added (default = null)
   successClass: 'success', // in case of loading image success what class should be added (default = null)
   onError: function(image){}, // function fired on loading error
   onSuccess: function(image){}, // function fired on loading success
   container: angular.element(scrollable) // if scrollable container is not $window then provide it here. This can also be an array of elements.
 });
});
//once the html is ready we attach the angularjs directive app into the body
angular.element(document).ready(function () {
    if (window.cordova) {
        document.addEventListener('deviceready', function () {
            angular.bootstrap(document.body, ['bibauapp']);
        }, false);
    } else {
        angular.bootstrap(document.body, ['bibauapp']);
    }
});
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

var Base64 = {

    keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this.keyStr.charAt(enc1) +
                this.keyStr.charAt(enc2) +
                this.keyStr.charAt(enc3) +
                this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    },

    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            window.alert("There were invalid base64 characters in the input text.\n" +
                "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
    }
};

bibauapp.controller('introController', function ($scope, $rootScope, $location, $timeout, $http, $cookies) {

    $scope.loading = true;
    $('#introcontain').height(window.screen.height);

    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/intro'
    }).then(function (data) {
        $scope.linkintro = data.data.Hinh;
        $scope.loading = false;
        $timeout(function () {
            $location.path('login');
        }, 5000);
    }, function (error) {

    });

    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe("#box-content", "fadeIn", 0.1);

});
bibauapp.controller('loginController', ['$scope', '$location', '$timeout', '$http', '$rootScope', '$cookies', 'ngDialog', function ($scope, $location, $timeout, $http, $rootScope, $cookies, ngDialog) {

    if ($cookies.get('globals') != null) {
        $rootScope.globals = $cookies.getObject('globals');
        $location.path('nhomsanpham/');
    }

    $rootScope.$on('event:social-sign-in-success', function(event, userDetails){
      $http({
          method: 'POST',
          url: 'http://test.toppion.com/api/users',
          params: userDetails
      }).then(function (data) {
          if (data.data !== null ) {
              $location.path('nhomsanpham/');
          }
      }, function (error) {

      });
    })

    $scope.submitLogin = function () {
        if ($scope.username == null || $scope.username == '') {
            $scope.error = "Vui lòng nhập Địa chỉ Email/số điện thoại";
            ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            return;
        }
        if ($scope.password == null || $scope.password == '') {
            $scope.error = "Vui lòng nhập Mật khẩu";
            ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            return;
        }

        $http({
            method: 'GET',
            url: 'http://test.toppion.com/api/users',
            params: { username: $scope.username }
        }).then(function (data) {
            if (data.data !== null && data.data.Pass === $scope.password) {
                SetCredentials(data.data, $scope.username, $scope.password);
                $location.path('nhomsanpham/');
            } else {
                $scope.error = "Mật khẩu không đúng";
                ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            }
        }, function (error) {
            $scope.error = "Tên đăng nhập/số điện thoại hoặc mật khẩu không đúng";
            ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
        });
    };


    function SetCredentials(data, username, password) {
        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                userid: data.ID,
                username: username,
                authdata: authdata,
                fullname: data.Ten,
                phone: data.Phone,
                birthday: data.BirthDay,
                email: data.Email,
                avatar: data.Avatar,
                gender: data.Gender
            }
        };

        // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
    }
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe("#box-content", "fadeIn", 0.1);
}]);

bibauapp.controller('nhomsanphamController', function ($scope, $location, $timeout, $http, $sce) {
  $scope.loading = true;
    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/nhomsanpham'
    }).then(function (data) {
        $scope.nhomsanpham = data.data;
        $timeout(function(){
          $scope.loading = false;
        },500)
    }, function (error) {

    });
    $scope.get_pre = function (x) {
        return $sce.trustAsHtml(x);
    };
    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.togglenhomcap2 = function (index) {
        $(".ulda" + index + "").slideToggle("fast");

        $('html,body').animate({
            scrollTop: $(".nhom-" + index + "").offset().top - 10
        },
            'slow');
    };
    $scope.directSanPham = function (id) {
        $location.path('sanpham/' + id);
    };
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);
});
bibauapp.controller('sanphamController', function ($scope, $location, $timeout, $http, $sce, $routeParams, $cookies, $rootScope) {

    var id = $routeParams.id;
    $scope.checkLogin = false;
    var userid = 0;
    if ($cookies.get('globals')) {
        $scope.checkLogin = true;
        if ($rootScope.globals == null) {
            $rootScope.globals = $cookies.getObject('globals');
            userid = $rootScope.globals.currentUser.userid;
        }
    }

    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/nhomsanpham',
        params: { userid: userid, id: id }
    }).then(function (data) {
        $scope.tennhom = data.data.Ten;
        $scope.danhsachsanpham = data.data.DanhSachSanPham;
    }, function (error) {

    });
    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.get_pre = function (x) {
        return $sce.trustAsHtml(x);
    };

    $scope.onSwipeRight = function () {
        $location.path('nhomsanpham');
    }

    $scope.directChiTietSanPham = function (id) {
        $location.path('chitietsanpham/' + id);
    };
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);


    $scope.toggleWishList = function (id) {

        $http({
            method: 'POST',
            url: 'http://test.toppion.com/api/wishlist',
            params: { userid: $rootScope.globals.currentUser.userid, id: id }
        }).then(function (data) {
            if (data.data) {
                $('.wishlist-' + id).toggleClass('clickheart');
            }
            else {
            }
        }, function (error) {

        });
    }

});

bibauapp.controller('chitietsanphamController', function ($scope, $location, $timeout, $http, $sce, $routeParams) {
    var id = $routeParams.id;
    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/sanpham/' + id + ''
    }).then(function (data) {
        $scope.idnhom = data.data.cID;
        $scope.tennhom = data.data.Ten;
        $scope.noidung = data.data.NoiDung;
    }, function (error) {

    });
    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.get_pre = function (x) {
        return $sce.trustAsHtml(x);
    };

    $scope.onSwipeRight = function (id) {
        $location.path('sanpham/' + id);
    }
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);
});


bibauapp.controller('tintucController', function ($scope, $location, $timeout, $http, $sce) {
  $scope.loading = true;
    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/tintuc/'
    }).then(function (data) {
        $scope.danhsachtintuc = data.data;
        $scope.loading = false;
    }, function (error) {

    });

    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.directChiTietTinTuc = function (id) {
        $location.path('chitiettintuc/' + id);
    };
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);
});


bibauapp.controller('chitiettintucController', function ($scope, $location, $timeout, $http, $sce, $routeParams) {
    var id = $routeParams.id;
    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/tintuc/' + id + ''
    }).then(function (data) {
        $scope.ten = data.data.Ten;
        $scope.noidung = data.data.NoiDung;
    }, function (error) {

    });
    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.get_pre = function (x) {
        return $sce.trustAsHtml(x);
    };

    $scope.onSwipeRight = function () {
        $location.path('tintuc');
    }
});


bibauapp.controller('accountController', function ($scope, $location, $timeout, $http, $sce, $cookies, $rootScope, ngDialog) {
    //$http({
    //    method: 'GET',
    //    url: 'http://test.toppion.com/api/tintuc/'
    //}).then(function (data) {
    //    $scope.danhsachtintuc = data.data;
    //}, function (error) {

    //});

    $scope.checkLogin = false;
    if ($cookies.get('globals') != null) {
        $scope.checkLogin = true;
        if ($rootScope.globals == null) {
            $rootScope.globals = $cookies.getObject('globals');
        }
    }
    else {
        $location.path('login');
    }

    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');

    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);

    $scope.changePass = function () {
        ngDialog.open({
            template: 'pages/changePass.html',
            controller: 'changePassController'
        });
    };
    $scope.myWishList = function () {
        $location.path('sanphamwishlist');
    };
    $scope.myInformation = function () {
        $location.path('information');
    };
    $scope.logOut = function () {
        $cookies.remove('globals');
        $rootScope.globals == null;
        $location.path('nhomsanpham');
    };

});

bibauapp.controller('changePassController', function ($scope, $location, $timeout, $http, $sce, $cookies, $rootScope, ngDialog) {
    $scope.checkChange = true;
    $scope.SaveChangePass = function () {
        if ($rootScope.globals == null) {
            $rootScope.globals = $cookies.getObject('globals');
        }
        if ($scope.password == null || $scope.password == '') {
            $scope.error = "Vui lòng nhập Mật khẩu cũ";
            return;
        }
        if ($scope.passwordnew == null || $scope.passwordnew == '') {
            $scope.error = "Vui lòng nhập Mật khẩu mới";
            return;
        }
        var au = Base64.decode($rootScope.globals.currentUser.authdata).split(':')[1];
        if (au === $scope.password) {
            $scope.error = "";
            $http({
                method: 'POST',
                url: 'http://test.toppion.com/api/changepass',
                params: { userid: $rootScope.globals.currentUser.userid, pass: $scope.passwordnew }
            }).then(function (data) {
                if (data.data) {
                    var authdata = Base64.encode($rootScope.globals.currentUser.username + ':' + $scope.passwordnew);
                    $rootScope.globals.currentUser.authdata = authdata;

                    // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
                    var cookieExp = new Date();
                    cookieExp.setDate(cookieExp.getDate() + 7);
                    $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });

                    $scope.error = "Thay đổi Mật khẩu thành công";
                    $scope.checkChange = false;
                }
                else {
                    $scope.error = "Không thể thay đổi mật khẩu. Vui lòng thao tác lại.";
                }
            }, function (error) {

            });
        }
        else {
            $scope.error = "Mật khẩu cũ không đúng";
            return;
        }

    };


});

bibauapp.controller('sanphamwishlistController', function ($scope, $location, $timeout, $http, $sce, $routeParams, $cookies, $rootScope) {

    var id = $routeParams.id;
    $scope.checkLogin = false;
    if ($cookies.get('globals') != null) {
        $scope.checkLogin = true;
        if ($rootScope.globals == null) {
            $rootScope.globals = $cookies.getObject('globals');
        }
    }


    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/sanphamwishlist',
        params: { userid: $rootScope.globals.currentUser.userid }
    }).then(function (data) {
        $scope.tennhom = "Sản phẩm yêu thích";
        $scope.danhsachsanpham = data.data;
    }, function (error) {

    });

    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.get_pre = function (x) {
        return $sce.trustAsHtml(x);
    };

    $scope.onSwipeRight = function () {
        $location.path('account');
    }

    $scope.directChiTietSanPham = function (id) {
        $location.path('chitietsanphamwishlist/' + id);
    };
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);



});

bibauapp.controller('chitietsanphamwishlistController', function ($scope, $location, $timeout, $http, $sce, $routeParams) {
    var id = $routeParams.id;
    $http({
        method: 'GET',
        url: 'http://test.toppion.com/api/sanpham/' + id + ''
    }).then(function (data) {
        $scope.idnhom = data.data.cID;
        $scope.tennhom = data.data.Ten;
        $scope.noidung = data.data.NoiDung;
    }, function (error) {

    });
    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height()) + 'px');
    $scope.get_pre = function (x) {
        return $sce.trustAsHtml(x);
    };

    $scope.onSwipeRight = function () {
        $location.path('sanphamwishlist');
    }
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);
});


bibauapp.controller('informationController', function ($scope, $location, $timeout, $http, $sce, $cookies, $rootScope, ngDialog) {

    $scope.checkLogin = false;
    if ($cookies.get('globals') != null) {
        $scope.checkLogin = true;
        if ($rootScope.globals == null) {
            $rootScope.globals = $cookies.getObject('globals');
        }

    }
    else {
        $location.path('login');
    }
    
    $scope.updatePhoneModal = function(){
      $scope.error = "Vui lòng cập nhật số điện thoại";
      ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
      return;
    }

    $rootScope.$on('$locationChangeStart', function(){
      if(!$rootScope.globals.currentUser.phone){
        $scope.updatePhoneModal();
        $location.path('information');
      }
    })
    $scope.picture = $rootScope.globals.currentUser.avatar;
    $('.divcontain-nhomsanpham').css('margin-bottom', ($('.div-bottom').height() + 20) + 'px');

    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe(".box-content", "fadeIn", 0.1);
    $scope.changePicture = function () {

        navigator.camera.getPicture(onSuccess, onFail,
            {
                //sourceType: Camera.PictureSourceType.CAMERA,
                //correctOrientation: true,
                //quality: 75,
                //targetWidth: 200,
                //destinationType: Camera.DestinationType.DATA_URL,
                //encodingType: Camera.EncodingType.PNG,
                //saveToPhotoAlbum: false
                quality: 100,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                destinationType: Camera.DestinationType.FILE_URI
            });
        function onSuccess(imageData) {
            $scope.picture = imageData + '?' + Math.random();
            $scope.$apply();
        }

        function onFail(message) {
            if (appConstants.debug) {
                alert('Failed because: ' + message);
            }
        }
    };
    $scope.updateInfo = function () {

        $http({
            method: 'POST',
            url: 'http://test.toppion.com/api/updateinfo',
            params: {
                userid: $rootScope.globals.currentUser.userid,
                fullname: $rootScope.globals.currentUser.fullname,
                gender: $('#dropDownId :selected').text(),
                phone: $rootScope.globals.currentUser.phone,
                email: $rootScope.globals.currentUser.email,
                avatar: $scope.picture
            }
        }).then(function (data) {
            if (data.data) {
                $rootScope.globals.currentUser.gender = $('#dropDownId :selected').text();
                $rootScope.globals.currentUser.avatar = $scope.picture;
                var cookieExp = new Date();
                cookieExp.setDate(cookieExp.getDate() + 7);
                $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });

                $scope.error = "Cập nhật thông tin thành công";
                ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            }
            else {
            }
        }, function (error) {

        });
    }
});

bibauapp.controller('registerController', ['$scope', '$location', '$timeout', '$http', '$rootScope', '$cookies', 'ngDialog', function ($scope, $location, $timeout, $http, $rootScope, $cookies, ngDialog) {
  function validateEmail(email) { //Validates the email address
    var emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return emailRegex.test(email);
    }

    function validatePhone(phone) { //Validates the phone number
      var phoneRegex = /^[0-9-+]+$/;
        return phoneRegex.test(phone);
    }

    function doValidate(data) {
      if(validateEmail(data) || validatePhone(data)){
        return true;
      }else{
        return false;
      }
    }
    $scope.submitRegister = function () {
        if ($scope.username == null || $scope.username == '') {
            $scope.error = "Vui lòng nhập Địa chỉ Email/số điện thoại";
            ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            return;
        }
        if(!doValidate($scope.username)){
          $scope.error = "Email hoặc số điện thoại không chính xác";
          ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
          return;
        }
        
        if ($scope.password == null || $scope.password == '') {
            $scope.error = "Vui lòng nhập Mật khẩu";
            ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            return;
        }

        $http({
            method: 'GET',
            url: 'http://test.toppion.com/api/register',
            params: { uuid: '1234567', username: $scope.username, pass: $scope.password }
        }).then(function (data) {
            if (data.data !== null) {
                SetCredentialsReg(data.data, $scope.username, $scope.password);
                $location.path('information');
            } else {
                $scope.error = "Mật khẩu không đúng";
                ngDialog.open({ template: 'pages/alertTml.html', className: 'ngdialog-theme-default', scope: $scope });
            }

        }, function (error) {

        });
    };


    function SetCredentialsReg(data, username, password) {
        var authdata = Base64.encode(username + ':' + password);

        $rootScope.globals = {
            currentUser: {
                userid: data.ID,
                username: username,
                authdata: authdata,
                fullname: data.Ten,
                phone: data.Phone,
                birthday: data.BirthDay,
                email: data.Email,
                avatar: data.Avatar,
                gender: data.Gender
            }
        };

        // store user details in globals cookie that keeps user logged in for 1 week (or until they logout)
        var cookieExp = new Date();
        cookieExp.setDate(cookieExp.getDate() + 7);
        $cookies.putObject('globals', $rootScope.globals, { expires: cookieExp });
    }
    function animateMe(myObject, animateType, duration) {
        $(myObject).addClass("animated " + animateType).css("animation-delay", duration + "s");
    }

    //we add the fadeIn animation with 0.1 seconds, for more information animate css, please google animate.css in your browser, there are varieties of animations available.
    animateMe("#box-content", "fadeIn", 0.1);
}]);
bibauapp.directive(
  "bnLazySrc",
  function( $window, $document ) {


    // I manage all the images that are currently being
    // monitored on the page for lazy loading.
    var lazyLoader = (function() {

      // I maintain a list of images that lazy-loading
      // and have yet to be rendered.
      var images = [];

      // I define the render timer for the lazy loading
      // images to that the DOM-querying (for offsets)
      // is chunked in groups.
      var renderTimer = null;
      var renderDelay = 100;

      // I cache the window element as a jQuery reference.
      var win = $( $window );

      // I cache the document document height so that
      // we can respond to changes in the height due to
      // dynamic content.
      var doc = $document;
      var documentHeight = doc.height();
      var documentTimer = null;
      var documentDelay = 2000;

      // I determine if the window dimension events
      // (ie. resize, scroll) are currenlty being
      // monitored for changes.
      var isWatchingWindow = false;


      // ---
      // PUBLIC METHODS.
      // ---


      // I start monitoring the given image for visibility
      // and then render it when necessary.
      function addImage( image ) {

        images.push( image );

        if ( ! renderTimer ) {

          startRenderTimer();

        }

        if ( ! isWatchingWindow ) {

          startWatchingWindow();

        }

      }


      // I remove the given image from the render queue.
      function removeImage( image ) {

        // Remove the given image from the render queue.
        for ( var i = 0 ; i < images.length ; i++ ) {

          if ( images[ i ] === image ) {

            images.splice( i, 1 );
            break;

          }

        }

        // If removing the given image has cleared the
        // render queue, then we can stop monitoring
        // the window and the image queue.
        if ( ! images.length ) {

          clearRenderTimer();

          stopWatchingWindow();

        }

      }


      // ---
      // PRIVATE METHODS.
      // ---


      // I check the document height to see if it's changed.
      function checkDocumentHeight() {

        // If the render time is currently active, then
        // don't bother getting the document height -
        // it won't actually do anything.
        if ( renderTimer ) {

          return;

        }

        var currentDocumentHeight = doc.height();

        // If the height has not changed, then ignore -
        // no more images could have come into view.
        if ( currentDocumentHeight === documentHeight ) {

          return;

        }

        // Cache the new document height.
        documentHeight = currentDocumentHeight;

        startRenderTimer();

      }


      // I check the lazy-load images that have yet to
      // be rendered.
      function checkImages() {

        // Log here so we can see how often this
        // gets called during page activity.
        console.log( "Checking for visible images..." );

        var visible = [];
        var hidden = [];

        // Determine the window dimensions.
        var windowHeight = win.height();
        var scrollTop = win.scrollTop();

        // Calculate the viewport offsets.
        var topFoldOffset = scrollTop;
        var bottomFoldOffset = ( topFoldOffset + windowHeight );

        // Query the DOM for layout and seperate the
        // images into two different categories: those
        // that are now in the viewport and those that
        // still remain hidden.
        for ( var i = 0 ; i < images.length ; i++ ) {

          var image = images[ i ];

          if ( image.isVisible( topFoldOffset, bottomFoldOffset ) ) {

            visible.push( image );

          } else {

            hidden.push( image );

          }

        }

        // Update the DOM with new image source values.
        for ( var i = 0 ; i < visible.length ; i++ ) {

          visible[ i ].render();

        }

        // Keep the still-hidden images as the new
        // image queue to be monitored.
        images = hidden;

        // Clear the render timer so that it can be set
        // again in response to window changes.
        clearRenderTimer();

        // If we've rendered all the images, then stop
        // monitoring the window for changes.
        if ( ! images.length ) {

          stopWatchingWindow();

        }

      }


      // I clear the render timer so that we can easily
      // check to see if the timer is running.
      function clearRenderTimer() {

        clearTimeout( renderTimer );

        renderTimer = null;

      }


      // I start the render time, allowing more images to
      // be added to the images queue before the render
      // action is executed.
      function startRenderTimer() {

        renderTimer = setTimeout( checkImages, renderDelay );

      }


      // I start watching the window for changes in dimension.
      function startWatchingWindow() {

        isWatchingWindow = true;

        // Listen for window changes.
        win.on( "resize.bnLazySrc", windowChanged );
        win.on( "scroll.bnLazySrc", windowChanged );

        // Set up a timer to watch for document-height changes.
        documentTimer = setInterval( checkDocumentHeight, documentDelay );

      }


      // I stop watching the window for changes in dimension.
      function stopWatchingWindow() {

        isWatchingWindow = false;

        // Stop watching for window changes.
        win.off( "resize.bnLazySrc" );
        win.off( "scroll.bnLazySrc" );

        // Stop watching for document changes.
        clearInterval( documentTimer );

      }


      // I start the render time if the window changes.
      function windowChanged() {

        if ( ! renderTimer ) {

          startRenderTimer();

        }

      }


      // Return the public API.
      return({
        addImage: addImage,
        removeImage: removeImage
      });

    })();


    // ------------------------------------------ //
    // ------------------------------------------ //


    // I represent a single lazy-load image.
    function LazyImage( element ) {

      // I am the interpolated LAZY SRC attribute of
      // the image as reported by AngularJS.
      var source = null;

      // I determine if the image has already been
      // rendered (ie, that it has been exposed to the
      // viewport and the source had been loaded).
      var isRendered = false;

      // I am the cached height of the element. We are
      // going to assume that the image doesn't change
      // height over time.
      var height = null;


      // ---
      // PUBLIC METHODS.
      // ---


      // I determine if the element is above the given
      // fold of the page.
      function isVisible( topFoldOffset, bottomFoldOffset ) {

        // If the element is not visible because it
        // is hidden, don't bother testing it.
        if ( ! element.is( ":visible" ) ) {

          return( false );

        }

        // If the height has not yet been calculated,
        // the cache it for the duration of the page.
        if ( height === null ) {

          height = element.height();

        }

        // Update the dimensions of the element.
        var top = element.offset().top;
        var bottom = ( top + height );

        // Return true if the element is:
        // 1. The top offset is in view.
        // 2. The bottom offset is in view.
        // 3. The element is overlapping the viewport.
        return(
            (
              ( top <= bottomFoldOffset ) &&
              ( top >= topFoldOffset )
            )
          ||
            (
              ( bottom <= bottomFoldOffset ) &&
              ( bottom >= topFoldOffset )
            )
          ||
            (
              ( top <= topFoldOffset ) &&
              ( bottom >= bottomFoldOffset )
            )
        );

      }


      // I move the cached source into the live source.
      function render() {

        isRendered = true;

        renderSource();

      }


      // I set the interpolated source value reported
      // by the directive / AngularJS.
      function setSource( newSource ) {

        source = newSource;

        if ( isRendered ) {

          renderSource();

        }

      }


      // ---
      // PRIVATE METHODS.
      // ---


      // I load the lazy source value into the actual
      // source value of the image element.
      function renderSource() {

        element[ 0 ].src = source;

      }


      // Return the public API.
      return({
        isVisible: isVisible,
        render: render,
        setSource: setSource
      });

    }


    // ------------------------------------------ //
    // ------------------------------------------ //


    // I bind the UI events to the scope.
    function link( $scope, element, attributes ) {

      var lazyImage = new LazyImage( element );

      // Start watching the image for changes in its
      // visibility.
      lazyLoader.addImage( lazyImage );


      // Since the lazy-src will likely need some sort
      // of string interpolation, we don't want to
      attributes.$observe(
        "bnLazySrc",
        function( newSource ) {

          lazyImage.setSource( newSource );

        }
      );


      // When the scope is destroyed, we need to remove
      // the image from the render queue.
      $scope.$on(
        "$destroy",
        function() {

          lazyLoader.removeImage( lazyImage );

        }
      );

    }


    // Return the directive configuration.
    return({
      link: link,
      restrict: "A"
    });

  }
);

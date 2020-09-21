app.controller("AnnouncementModalsController", ["$scope", '$q', "$rootScope", "$http", "$translate", "$state", "$filter", "$modal", "$modalInstance", "$interval", "$timeout", "ControllerConfig", "notify", "datecalculation", "params",
    function ($scope, $q, $rootScope, $http, $translate, $state, $filter, $modal, $modalInstance, $interval, $timeout, ControllerConfig, notify, datecalculation, params) {
        // $scope.config = $rootScope.scope.config;
        // var _newscope = $rootScope.scope;
        // $scope.fileNavigator = _newscope.fileNavigator;
        // $scope.temp = $rootScope.temp;
        // $scope.fileMemuTile = $rootScope.rootdir;
        $scope.type = [
            '部门公告',
            '外部公告'
        ]
        $scope.params = params;
        params.AgencyID;

        $scope.getLanguage = function () {
            $scope.LanJson = {
                StartTime: $translate.instant("QueryTableColumn.StartTime"),
                EndTime: $translate.instant("QueryTableColumn.EndTime"),
                //update by zhangj
                InvalidAgency: $translate.instant("Agent.WorkflowExists"),
                NoSelectWorkItem: $translate.instant("WarnOfNotMetCondition.NoSelectWorkItem"),
                NoSelectWasAgent: $translate.instant("WarnOfNotMetCondition.NoSelectWasAgent"),
                NoSelectWorkflows: $translate.instant("WarnOfNotMetCondition.NoSelectWorkflows"),
                InvalidOfTime: $translate.instant("WarnOfNotMetCondition.InvalidOfTime"),
                NoSelectOriginatorRange: $translate.instant("WarnOfNotMetCondition.NoSelectOriginatorRange")
            }
        }
        $scope.getLanguage();
        // 获取语言
        $rootScope.$on('$translateChangeEnd', function () {
            $scope.getLanguage();
            $state.go($state.$current.self.name, {}, { reload: true });
        });

        //控件初始化参数


        //设置权限控件不可编辑
        $scope.DetailOptions = {
            Visiable: true, IsMultiple: true //全选属性
        }
        $scope.OriginatorRangeOptions = {
            Editable: true, Visiable: true, OrgUnitVisible: false, UserVisible: false, PlaceHolder: $scope.LanJson.Originator, GroupVisible: true, IsMultiple: true
        }
        $scope.datechange = function (data) {
            if (data == 'null' || data == null) {
                data = '';
            }
            else {
                var time = new Date(data);
                var year = time.getFullYear();
                var month = time.getMonth() + 1 < 10 ? "0" + (time.getMonth() + 1) : time.getMonth();
                var date = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
                var hours = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
                var minutes = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
                var seconds = time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
                data = year + '-' + (month) + '-' + (date) + ' ' + (hours) + ':' + (minutes) + ':' + (seconds);
                return data;
            }
        }

        $scope.init = function () {

            //编辑初始化
            if (params.AgencyID != "") {

                $scope.name = params.AgencyID.title;
                $scope.createTime = $scope.datechange(params.AgencyID.createTime);
                $scope.startTime = $scope.datechange(params.AgencyID.startTime);
                $scope.endTime = $scope.datechange(params.AgencyID.endTime);
                $scope.tag = $scope.type[params.AgencyID.type - 1];
                $scope.description = params.AgencyID.description;
                $scope.link = params.AgencyID.link;

            }
        }

        $scope.init();



        deferredHandler = function (data, deferred, defaultMsg) {
            if (!data || typeof data !== 'object') {
                this.error = 'Bridge response error, please check the docs';
            }
            if (!this.error && data.result && data.result.error) {
                this.error = data.result.error;
            }
            if (!this.error && data.error) {
                this.error = data.error.message;
            }
            if (!this.error && defaultMsg) {
                this.error = defaultMsg;
            }
            if (this.error) {
                return deferred.reject(data);
            }
            return deferred.resolve(data);
        };


        $scope.EditStartTime = {
            dateFmt: 'yyyy-MM-dd HH:mm:ss', realDateFmt: "yyyy-MM-dd HH:mm:ss", minDate: '2012-1-1', maxDate: '2099-12-31',
            onpicked: function (e) {
                $rootScope.startTime = e.el.value;

            }
        }
        $scope.EditEndTime = {
            dateFmt: 'yyyy-MM-dd HH:mm:ss', realDateFmt: "yyyy-MM-dd HH:mm:ss", minDate: '2012-1-1', maxDate: '2099-12-31',
            onpicked: function (e) {
                $rootScope.endTime = e.el.value;
            }
        }


        updateannounce = function () {
            if ($rootScope.startTime == undefined && $rootScope.endTime == undefined) {
                var myStartTimes = new Date($scope.startTime.replace(/-/g, "/")).getTime();
                var myEndTimes = new Date($scope.endTime.replace(/-/g, "/")).getTime();
                if (myStartTimes > myEndTimes) {
                    $.notify({ message: "时间区间错误", status: "danger" });
                    $("#EditStartTime").css("color", "red");
                    $("#EditEndTime").css("color", "red");
                    return false;
                };
            }
            else if ($rootScope.startTime != undefined && $rootScope.endTime != undefined) {
                $scope.startTime = $rootScope.startTime;
                $scope.endTime = $rootScope.endTime;
                var myStartTimes = new Date($scope.startTime.replace(/-/g, "/")).getTime();
                var myEndTimes = new Date($scope.endTime.replace(/-/g, "/")).getTime();
                if (myStartTimes > myEndTimes) {
                    $.notify({ message: "时间区间错误", status: "danger" });
                    $("#EditStartTime").css("color", "red");
                    $("#EditEndTime").css("color", "red");
                    return false;
                };
            }
            else if ($rootScope.startTime != undefined && $rootScope.endTime == undefined) {
                $scope.startTime = $rootScope.startTime;
                var myStartTimes = new Date($scope.startTime.replace(/-/g, "/")).getTime();
                var myEndTimes = new Date($scope.endTime.replace(/-/g, "/")).getTime();
                if (myStartTimes > myEndTimes) {
                    $.notify({ message: "时间区间错误", status: "danger" });
                    $("#EditStartTime").css("color", "red");
                    $("#EditEndTime").css("color", "red");
                    return false;
                };
            }

            else if ($rootScope.startTime == undefined && $rootScope.endTime != undefined) {

                $scope.endTime = $rootScope.endTime;
                var myStartTimes = new Date($scope.startTime.replace(/-/g, "/")).getTime();
                var myEndTimes = new Date($scope.endTime.replace(/-/g, "/")).getTime();
                if (myStartTimes > myEndTimes) {
                    $.notify({ message: "时间区间错误", status: "danger" });
                    $("#EditStartTime").css("color", "red");
                    $("#EditEndTime").css("color", "red");
                    return false;
                };
            }
            var self = params.AgencyID;
            var selecttype = document.getElementById('editMyTag');
            $scope.index = selecttype.selectedIndex; //取类型的index值
            var deferred = $q.defer();
            var data = {
                id: self.id,
                title: $scope.name,
                description: $scope.description,
                type: $scope.index + 1,
                link: $scope.link,
                startTime: $scope.startTime,
                endTime: $scope.endTime,
                // permission: self.model.filePermission,
            };

            $http.post('/Portal/announcement/updateAnnouncement', data).success(function (data) {


                deferredHandler(data, deferred);
                $.notify({ message: data.msg, status: "success" });
            }).error(function (data) {

                deferredHandler(data, deferred, $translate.instant('error_creating_folder'));
            })['finally'](function () {
                // self.inprocess = false;
            });
            return deferred.promise;
        }

        //编辑公告
        $scope.editannounce = function () {
            var foldername = $scope.name;
            var type = $scope.tag;
            var desc = $scope.description;
            var msg = "";
            if (!foldername) {
                msg += '请输入公告标题 | ';
            }
            if (!type) {
                msg += '请选择类型 | ';
            }
            if (!desc) {
                msg += '请输入描述 | ';
            }
            msg = msg.substr(0, msg.length - 3);
            if (!msg) {
                updateannounce().then(function () {
                    $("#tabMyFlow").dataTable().fnDraw();
                });
            } else {
                $.notify({ message: msg, status: "danger" });
                return false;
            }
            $scope.cancel();
        };




        //新建公告
          	createannounce = function () {
            var self = params.AgencyID;
            var selecttype = document.getElementById('editMyTag');
            $scope.index = selecttype.selectedIndex; //取类型的index值
            var deferred = $q.defer();


            $scope.startTime = $rootScope.startTime;
            $scope.endTime = $rootScope.endTime;
            var myStartTimes = new Date($scope.startTime.replace(/-/g, "/")).getTime();
            var myEndTimes = new Date($scope.endTime.replace(/-/g, "/")).getTime();
            if (myStartTimes > myEndTimes) {
                $.notify({ message: "时间区间错误", status: "danger" });
                $("#EditStartTime").css("color", "red");
                $("#EditEndTime").css("color", "red");
                return false;
            };


            var data = {
                id: self.id,
                title: $scope.name,
                description: $scope.description,
                type: $scope.index + 1,
                link: $scope.link,
                startTime: $scope.startTime,
                endTime: $scope.endTime,
            };

            $http.post('/Portal/announcement/createAnnouncement', data).success(function (data) {
                deferredHandler(data, deferred);
                $.notify({ message: data.msg, status: "success" });
            }).error(function (data) {

                deferredHandler(data, deferred, $translate.instant('error_creating_folder'));
            })['finally'](function () {
            });
            return deferred.promise;
        }


        $scope.createannouncement = function () {
            var foldername = $scope.name;
            var type = $scope.tag;
            var msg = "";
            var createStartTime = $scope.startTime
            var createEndTime = $scope.endTime
            if (!foldername) {
                msg += '请输入公告标题 | ';
            }
            if (!type) {
                msg += '请选择类型 | ';
            }
            if (!createStartTime) {
                msg += '请选择开始时间 | ';
            }
            if (!createEndTime) {
                msg += '请选择结束时间 | ';
            }
            msg = msg.substr(0, msg.length - 3);
            if (!msg) {
                createannounce().then(function () {
                    $("#tabMyFlow").dataTable().fnDraw();
                });
            } else {
                $.notify({ message: msg, status: "danger" });
                return false;
            }
            $scope.cancel();
        };

        //删除操作

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel'); // 退出
        }
        $rootScope.cancel = $scope.cancel;


        //删除

        removeAnnounce = function () {
            var self = params.AgencyID;
            var deferred = $q.defer();
            var data = {
                id: params.AgencyID.id
            };

            $http({
                method: "GET",
                url: '/Portal/announcement/deleteAnnouncement?id=' + params.AgencyID.id,
            }).success(function (data) {
                debugger;
                deferredHandler(data, deferred);
                $.notify({ message: data.msg, status: "success" });
            }).error(function (data) {
                deferredHandler(data, deferred, $translate.instant('error_deleting'));
            })['finally'](function () {

            });
            return deferred.promise;
        }
        $scope.removeAnnouncement = function () {
            removeAnnounce().then(function () {
                $("#tabMyFlow").dataTable().fnDraw();
            });
            $scope.cancel();
        }
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel'); // 退出
        }
        $rootScope.cancel = $scope.cancel;

    }]);




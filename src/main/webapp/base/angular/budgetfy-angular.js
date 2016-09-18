/**
 * Created by Laurie on 7/4/2016.
 */
angular.module("budgetfyApp", ["selectize","angularUtils.directives.dirPagination"])
    .config(function ($httpProvider,paginationTemplateProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] =  "application/json";
        paginationTemplateProvider.setPath('css/dirPagination.tpl.html');
    })
    .controller("userRoleController", ["$scope", "$filter", "userRoleService", function($scope, $filter, userRoleService){
        $scope.loadInitData = function(){
            userRoleService.getAllUserRole().then(function(results){
                $scope.userRoleMaxSize = results.listSize;
                $scope.userRoleList = results.results;
            });

            userRoleService.getAllAuthorities().then(function(results){
                createTreeRole(results);
                $('#role-tree').bonsai('update');
            });
        };

        var createTreeRole = function(data){

        };
    }])
    .controller("userController", ["$scope","userService", "referenceLookUpService", function($scope, userService, referenceLookUpService){
        $scope.loadInitData = function(){
            userService.getAllUsers().then(function(results){
                $scope.userMaxSize = results.listSize;
                $scope.userList = results.results;
            });
        };

        $scope.viewUser = function(id){
            $scope.selectedUser = userService.findUserInList($scope.userList, id);
            $("div#user-main").addClass("hide");
            $("div#user-update").removeClass("hide");
        };

        $('form#create-user-form').on('formvalid.zf.abide', function () {
            userService.createNewUser($scope.createUser).then(function successCallback(response){
                if(response.status){
                    $("#user-main").removeClass("hide");
                    $("#user-create").addClass("hide");
                    $("#user-view").addClass("hide");
                    $("#user-update").addClass("hide");
                } else {

                }
            }, function errorCallback(error){

            });
        });


    }])
    .controller("referenceLookUpController", ["$scope", "$filter", "referenceLookUpService", function($scope, $filter, referenceLookUpService){
        $scope.loadInitData = function(){
            referenceLookUpService.getAllReference().then(function(results){
                $scope.referenceLookUpMaxSize = results.listSize;
                $scope.referenceLookUpList = results.results;
            });

            referenceLookUpService.getAllCategory().then(function(results){
                $scope.categoryList = results
            });
        };

        $scope.viewReference = function(id){
            $scope.selectedReference = referenceLookUpService.findReferenceInList($scope.referenceLookUpList, id);
            $("div#reference-look-up-main").addClass("hide");
            $("div#reference-look-up-update").removeClass("hide");
        };

        $scope.deleteReference = function(id) {
            referenceLookUpService.deleteReference(id).then(function(result){
                console.log(result);
            });
        };

        $('form#create-reference-form').on('formvalid.zf.abide', function () {
            referenceLookUpService.saveReference($scope.createReference).then(function successCallback(response){
                if(response.status){
                    $("div#reference-look-up-main").removeClass("hide");
                    $("div#reference-look-up-create").addClass("hide");
                } else {

                }
            }, function errorCallback(error){

            });
        });

        $('form#update-reference-form').on('formvalid.zf.abide', function () {
            referenceLookUpService.saveReference($scope.selectedReference).then(function successCallback(response){
                if(response.status){
                    $("div#reference-look-up-main").removeClass("hide");
                    $("div#reference-look-up-update").addClass("hide");
                } else {

                }
            }, function errorCallback(error){

            });
        });
    }])
    .controller("voucherController", ["$scope","$http", "$filter","voucherService","programService","activityService","particularService","fileDetailService",function($scope,$http,$filter,voucherService,programService,activityService,particularService,fileDetailService){

        $scope.loadInitData = function(){
            voucherService.getAllVouchers().then(function(results){
                $scope.voucherMaxSize = results.listSize;
                $scope.voucherList = results.results;
            },function(error){

            });

            programService.getAllPrograms().then(function(results){
                $scope.programList = results.results;
            },function(error){

            });

            activityService.getAllActivities().then(function(results){
                $scope.activityList = results.results;
            });
        };

        $scope.viewVoucher = function(voucherId){
            var foundVoucher = voucherService.findVoucherInList($scope.voucherList,voucherId);
            $scope.selectedVoucher = foundVoucher;
            if ($.type(foundVoucher.date) === "string") {
                var date = foundVoucher.date.split("-");
                $scope.selectedVoucher.date = new Date(date[0], date[1]-1, date[2]);
            }

            particularService.findParticularsOfVoucher(voucherId).then(function(results){
                $scope.selectedVoucher.particulars = results.results

                $.each($scope.selectedVoucher.particulars,function(i, particular){
                    particular.activity = activityService.findActivityInList($scope.activityList, particular.activityId);
                    particular.activity.program = programService.findProgramInList($scope.programList, particular.activity.programId);
                });
            });
        };

        $scope.prepareNewVoucher = function(){
            $scope.createVoucher.particulars = $scope.newParticularList;
        };

        $scope.createVoucherObj = function(){
            voucherService.saveVoucher($scope.createVoucher).then(function (result){
                if(result.data.status){
                    $("#expense-main").removeClass("hide");
                    $("#expense-add-container").addClass("hide");
                    $("#expense-update-container").addClass("hide");
                }
            });
        };

        $scope.newParticularList = [];
        $scope.addNewParticular = function(attachmentContainer){
            var fileId = null;
            var preview = $("div#"+attachmentContainer).parent(".columns").find("img.ajax-file-upload-preview");
            if(preview.length>0){
                fileId = $(preview[0]).attr("data-upload-id");
            }
            var program = programService.findProgramInList($scope.programList,$scope.addParticular.addParticularProgramModel);
            var activity = activityService.findActivityInList($scope.programActivities,$scope.addParticular.addParticularActivityModel);

            var particular = {
                "description": $scope.addParticular.description,
                "expense": $scope.addParticular.expense,
                "activity": activity,
                "program": program
            };

            if(fileId!=null){
                particular.receipt = {"id":fileId};
            }

            MotionUI.animateOut($('#add-expense-form'), 'slide-out-up');
            $scope.newParticularList.push(particular);
        };

        $scope.addNewParticularSelectedVoucher = function(attachmentContainer){
            var fileId = null;
            var preview = $("div#"+attachmentContainer).parent(".columns").find("img.ajax-file-upload-preview");
            if(preview.length>0){
                fileId = $(preview[0]).attr("data-upload-id");
            }
            var program = programService.findProgramInList($scope.programList,$scope.addParticular.addParticularProgramModel);
            var activity = activityService.findActivityInList($scope.programActivities,$scope.addParticular.addParticularActivityModel);
            activity.program = program;

            var particular = {
                "description": $scope.addParticular.description,
                "expense": $scope.addParticular.expense,
                "displayExpense": evey.formatDisplayMoney($scope.addParticular.expense),
                "activity": activity
            };

            if(fileId!=null){
                particular.receipt = {"id":fileId};
                particular.receiptId = fileId;
            }

            MotionUI.animateOut($('div#add-exist-expense-form'), 'slide-out-up');
            $scope.selectedVoucher.particulars.unshift(particular);
        };

        $scope.viewSelectedParticular = function(particularId){
            $scope.selectedParticular = particularService.findParticularFromList($scope.selectedVoucher.particulars,particularId);

            if($scope.selectedParticular.activity!=null &&
                ($scope.selectedParticular.activityId==null ||
                $scope.selectedParticular.activityId=="" ||
                $scope.selectedParticular.activityId==undefined ||
                $scope.selectedParticular.activityId==0)){
                $scope.selectedParticular.activityId =$scope.selectedParticular.activity.id;
            }

            if($scope.selectedParticular.activity.program!=null &&
                ($scope.selectedParticular.activity.programId==null ||
                $scope.selectedParticular.activity.programId=="" ||
                $scope.selectedParticular.activity.programId==undefined ||
                $scope.selectedParticular.activity.programId==0)){
                $scope.selectedParticular.activity.programId =$scope.selectedParticular.program.id;
            }

            if($scope.selectedParticular.activity.programId!=null){
                activityService.getProgramActivities($scope.selectedParticular.activity.programId).then(function(results){
                    $scope.programActivities = results.results;
                },function(error){

                });
            }
        };

        $scope.programConfig =
        {
            valueField : 'id',
            labelField : 'programName',
            searchField: ['programName'],
            delimiter : '|',
            placeholder : 'Pick a Program',
            plugins: ['remove_button'],
            onInitialize : function (selectize) {
                // receives the selectize object as an argument
            },
            onChange: function(value) {
                activityService.getProgramActivities(value).then(function(results){
                    $scope.addParticularActivityModel = 0;
                    $scope.programActivities = results.results;
                },function(error){

                })
            },
            maxItems:1
        };

        $scope.programActivityConfig =
        {
            valueField : 'id',
            labelField : 'activityName',
            searchField: ['activityName'],
            delimiter : '|',
            placeholder : 'Pick an Activity',
            plugins: ['remove_button'],
            onInitialize : function (selectize) {
                // receives the selectize object as an argument
            },
            maxItems:1
        };

        programService.getAllPrograms().then(function(results){
            $scope.programList = results.results;
        },function(error){

        });

        $scope.downloadAttachment = function(fileId){
            fileDetailService.downloadFile(fileId)
        };


        $scope.removeParticularOnAdd = function(particular){
            $scope.newParticularList = $filter('filter')($scope.newParticularList, { description: ('!' + particular.description)/*, activity: {id: ("!"+particular.activity.id)}, program: {id: ("!"+particular.program.id)}  */});
        };

        $scope.removeParticular = function(particularId){
            particularService.deleteParticular(particularId).then(function(results){
                if(results.status){
                    $scope.selectedVoucher.particulars = $filter('filter')($scope.selectedVoucher.particulars, { id: ('!' +particularId)});
                }
            },function(error){

            });
        };

    }])
    .controller("programController",["$scope","$http","$filter","userService","referenceLookUpService","programService","activityService", "particularService", "voucherService",function($scope, $http,$filter,userService,referenceLookUpService,programService,activityService, particularService, voucherService){
        $scope.userSelectizeModel = 0;
        $scope.activityTypeSelectizeModel = 0;
        $scope.userSelectConfig =
        {
            valueField : 'id',
            labelField : 'userDisplay',
            searchField: ['username','firstName','lastName'],
            delimiter : '|',
            placeholder : 'Pick something',
            plugins: ['remove_button'],
            onInitialize : function (selectize) {
                // receives the selectize object as an argument
            },
            maxItems:1
        };

        $scope.activityTypeSelectConfig =
        {
            valueField : 'id',
            labelField : 'value',
            searchField: ['value'],
            delimiter : '|',
            placeholder : 'Pick something',
            plugins: ['remove_button'],
            onInitialize : function (selectize) {
                // receives the selectize object as an argument
            },
            maxItems:1
        };

        userService.getAllUsers().then(function(result){
            $scope.allUsersList = result.results;
        },function(error){
            console.log(error);
        });

        referenceLookUpService.getReferenceLookUpByCategory("ACTIVITY_TYPE").then(function(results){
            $scope.activityTypeList = results;
        },function(error){

        });

        referenceLookUpService.getReferenceLookUpByCategory("ACTIVITY_CODE").then(function(results){
            $scope.activityCodeList = results;
        },function(error){

        });

        $scope.loadInitData = function(){
            programService.getAllPrograms().then(function successCallback(results){
                $scope.programMaxSize = results.listSize;
                $scope.programList = results.results;
            },function errorCallback(error){

            });

            voucherService.getAllVouchers().then(function successCallback(results){
                $scope.voucherList = results.results;
            });

            activityService.getAllActivities().then(function successCallbck(results){
                $scope.activityList = results.results;
            });
        };

        $scope.loadPrograms = function(){
            programService.getAllPrograms().then(function successCallback(results){
                $scope.programMaxSize = results.listSize;
                $scope.programList = results.results;
            },function errorCallback(error){

            });
        };

        $scope.removeActivityProgram = function(activityId){
            activityService.removeActivityFromProgram(activityId).then(function (results){
                if(results.status){
                    $scope.selectedProgram.activities = $filter('filter')($scope.selectedProgram.activities , { id: ('!' + activityId) });
                }

                console.log(results);
            }, function (error){

            });
        };

        $scope.addedUserList = [];
        $scope.addUser = function(){
            var row = $("#add-user-template").parents("div.row");

            var userId = $(row).find("selectize").val();
            var userName = $(row).find(".selectize-input .item").text();
            var readAccess = $(row).find("#read-access").is(":checked");
            var writeAccess = $(row).find("#write-access").is(":checked");
            var updateAccess = $(row).find("#update-access").is(":checked");
            var deleteAccess = $(row).find("#delete-access").is(":checked");

            var user = {
                id:userId,
                userName:userName,
                readAccess:readAccess,
                writeAccess:writeAccess,
                updateAccess:updateAccess,
                deleteAccess:deleteAccess,
                accessSummary:""
            };
            $scope.addedUserList.push(user);
        };

        $scope.removeUserFromList = function(id){
            $scope.addedUserList = $filter('filter')($scope.addedUserList , { id: ('!' + id) });
        };

        $scope.showSummary = function(){
            var programName = $("#program-name").val();
            var totalBudget = $("#total-budget").val();
            var percentage = $("#percentage").val();
            var threshold = $("#threshold").val();
            var programStart = $("#program-start").val();
            var programEnd = $("#program-end").val();

            var userAccessList = [];
            $.each($scope.addedUserList, function(i,user){
                var programAccessSet = [];
                if(user.readAccess){
                    programAccessSet.push({access:"PROGRAM_READ_ACCESS"});
                    user.accessSummary += "Read";
                }
                if(user.writeAccess){
                    programAccessSet.push({access:"PROGRAM_WRITE_ACCESS"});
                    if(user.accessSummary!=null && user.accessSummary!="" && user.accessSummary.length>0){
                        user.accessSummary += ", ";
                    }
                    user.accessSummary += "Write";
                }
                if(user.updateAccess){
                    programAccessSet.push({access:"PROGRAM_UPDATE_ACCESS"});
                    if(user.accessSummary!=null && user.accessSummary!="" && user.accessSummary.length>0){
                        user.accessSummary += ", ";
                    }
                    user.accessSummary += "Update";
                }
                if(user.deleteAccess){
                    programAccessSet.push({access:"PROGRAM_DELETE_ACCESS"});
                    if(user.accessSummary!=null && user.accessSummary!="" && user.accessSummary.length>0){
                        user.accessSummary += ", ";
                    }
                    user.accessSummary += "Delete";
                }
                var userAccess = {
                    userId:user.id,
                    programAccessSet: programAccessSet
                };

                userAccessList.push(userAccess);
            });

            $scope.programObject = {
                programName:programName,
                totalBudget:Number(totalBudget.replace(/,/g, '')),
                percentage:Number(percentage),
                threshold:Number(threshold.replace(/,/g, '')),
                programStart:programStart,
                programEnd:programEnd,
                activities: $scope.addedActivityList,
                userAccessList:userAccessList
            };
        };

        $scope.createProgram = function(){
            programService.createNewProgram($scope.programObject).then(function(results){
                if(results!=null && results){
                    $scope.programObject = null;
                    $scope.addedActivityList = [];
                    $scope.addedUserList = [];
                    window.location = evey.getHome()+"/budgetfy/program";
                }
            },function(error){

            });
        };

        $scope.viewProgram = function(programId){
            var found = $filter('filter')($scope.programList, {id: programId}, true);
            if(found.length>0){
                $scope.selectedProgram = found[0];
            }

            activityService.getProgramActivities(programId).then(function(data){
                $scope.selectedProgram.activities = data.results;
            });

            activityService.findActivityExpense(programId).then(function(data){
                $scope.selectedProgram.activityExpense = data.results;

                var labels = [];
                var forecastData = [];
                var actualsData = [];
                var totalActuals = 0;
                $.each(data.results,function(i,result){
                    labels.push(result.activity.activityName);
                    forecastData.push(result.activity.amount);
                    actualsData.push(result.expense);

                    totalActuals += result.expense;
                });
                var barChartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Forecast',
                        backgroundColor: "#2199e8",
                        data: forecastData
                    }, {
                        label: 'Actual',
                        backgroundColor: "#79c1f1",
                        data: actualsData
                    }]

                };

                var ctxBar = document.getElementById("bar-chart").getContext("2d");
                var bar = new Chart(ctxBar, {
                    type: 'bar',
                    data: barChartData,
                    options: {
                        elements: {
                            rectangle: {
                                borderWidth: 2,
                                borderColor: "#0f598a",
                                borderSkipped: 'bottom'
                            }
                        },
                        responsive: true,
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: 'Expense Chart'
                        }
                    }
                });

                $("#progressbar").progressbar({
                    value: (totalActuals/$scope.selectedProgram.totalBudget)*100
                });

                if($scope.selectedProgram.threshold<=totalActuals){
                    $("#progressbar .ui-progressbar-value").css('background-color','#ffae19');
                } else if ($scope.selectedProgram.threshold > totalActuals){
                    $("#progressbar .ui-progressbar-value").css('background-color','#3adb76');
                }

                if($scope.selectedProgram.totalBudget<totalActuals){
                    $("#progressbar .ui-progressbar-value").css('background-color','#ec5840');
                }

                $scope.unallocatedBudget = evey.addThousandsSeparator($scope.selectedProgram.totalBudget - totalActuals)

            });
        };

        $scope.viewActivityExpense = function(activityId){
            particularService.findParticularsOfActivity(activityId).then(function(result){
                $scope.activityExpense = result.results;

                $.each($scope.activityExpense, function(i, particular){
                    particular.voucher = voucherService.findVoucherInList($scope.voucherList, particular.voucherId);
                    particular.activity = activityService.findActivityInList($scope.activityList, particular.activityId);
                });
            }, function(error){

            });
        };

        $scope.selectActivityProgram = function(activityId){
            var found = $filter('filter')($scope.selectedProgram.activities, {id: activityId}, true);
            if(found.length>0){
                $scope.selectedActivity = found[0];
            }
        };

        $scope.updateActivity = function(){
            var foundType = $scope.activityTypeList.filter(function(type){
               return (type.id == $scope.selectedActivity.activityTypeId);
            });
            var foundCode = $scope.activityCodeList.filter(function(code){
                return (code.id == $scope.selectedActivity.activityCodeId);
            });
            if(foundCode.length>0){
                $scope.selectedActivity.activityCodeName = foundCode[0].value;
            }
            if(foundType.length>0){
                $scope.selectedActivity.activityName = foundType[0].value;
            }

            $scope.selectedActivity.activityType = {id:$scope.selectedActivity.activityTypeId};
            $scope.selectedActivity.activityCode = {id:$scope.selectedActivity.activityCodeId};
            $scope.selectedActivity.program = {id:$scope.selectedActivity.programId};
            activityService.addUpdateActivity($scope.selectedActivity).then(function(data){
                $scope.selectedProgram.activities.filter(function(activity){
                    if(activity.id==data.data.result.id){
                        activity == data.data.result;
                    }
                });
            });
        };

        $scope.addActivityToProgram = function(){
            var activityType = $("#activity-form .selectize-input div.item").text();
            var activityId = $("#activity-form .selectize-input div.item").attr("data-value");
            var activityCodeId = $("#activity-form option:selected").val();
            var activityCodeDisplay = $("#activity-form option:selected").text();
            var activityBudget = $("#activity-budget").val();

            var activityObject = {
                activityTypeId:activityId,
                activityType : {id:activityId},
                activityName:activityType,
                activityCodeId:activityCodeId,
                activityCode:{id:activityCodeId},
                amount: activityBudget,
                activityCodeName:activityCodeDisplay,
                program: {id:$scope.selectedProgram.id}
            };
            activityService.addUpdateActivity(activityObject).then(function(data){
                MotionUI.animateOut($('#activity-form'), 'slide-out-up');
                $scope.selectedProgram.activities.unshift(data.data.result);
            });
        };

        $scope.addedActivityList = [];
        $scope.addActivity = function(){
            var activityType = $("#program-activity .selectize-input div.item").text();
            var activityId = $("#program-activity .selectize-input div.item").attr("data-value");
            var activityCodeId = $("#activity-code option:selected").val();
            var activityCodeDisplay = $("#activity-code option:selected").text();
            var activityBudget = $("#activity-budget").val();

            var activityObject = {
                activityTypeId:activityId,
                activityName:activityType,
                activityCodeId:activityCodeId,
                amount: activityBudget,
                activityCodeName:activityCodeDisplay
            };

            $scope.addedActivityList.unshift(activityObject);

            $scope.remainingBudget = parseInt($("#total-budget").val().replace(/\,/g,''));
            $.each($scope.addedActivityList, function(i, activity){
                $scope.remainingBudget -= activity.amount;
            });
        };

        $scope.removeAddedActivity = function(id){
            $scope.addedActivityList = $filter('filter')($scope.addedActivityList , { activityTypeId: ('!' + id) });
        };


    }])
    .service("userService", function($http){
        this.getAllUsers = function(){
            return $http.get("/budgetfy/user/findAll").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.createNewUser = function(user){
            console.log(user);
            return $http.post("/budgetfy/user/",user)
                .then(function(response){
                    return response.data;
                }, function(error) {
                    console.log(error);
                });
        };

        this.findUserInList = function(userList, id){
            var foundUser = userList.filter(function(user){
                return (user.id == id);
            });
            if(foundUser.length>0){
                return foundUser[0];
            }
            return null;
        };
    })
    .service("referenceLookUpService",function($http){
        this.getReferenceLookUpByCategory = function(categoryName){
            return $http.get("/budgetfy/reference/getReferenceLookUpByCategory/"+categoryName).then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.getAllReference = function(){
            return $http.get("/budgetfy/reference/findAll").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.getAllCategory = function(){
            return $http.get("/budgetfy/reference/findAllCategory").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.saveReference = function(reference){
            return $http.post("/budgetfy/reference/",reference)
                .then(function(response){
                    return response.data;
                }, function(error) {
                    console.log(error);
                });
        };

        this.deleteReference = function(id){
            console.log("performing delete ", id);
            return $http.delete("/budgetfy/reference/"+id)
                .then(function(response){
                    return response.data;
                }, function(error) {
                    console.log(error);
                });
        };

        this.findReferenceInList = function(referenceList,id){
            var foundReference = referenceList.filter(function(reference){
                return (reference.id == id);
            });
            if(foundReference.length>0){
                return foundReference[0];
            }
            return null;
        };
    })
    .service("programService",function($http){
        this.createNewProgram = function(program){
            return $http.post("/budgetfy/program/create-program/create",program)
                .then(function(response){
                    if(response.data.success){
                        return true;
                    } else {
                        console.log("error");
                    }
                }, function(error) {
                    console.log(error);
                });
        };

        this.findProgramInList = function(programList, id){
            var foundProgram = programList.filter(function(program){
                return (program.id == id);
            });
            if(foundProgram.length>0){
                return foundProgram[0];
            }
            return null;
        };

        this.getAllPrograms = function(){
            return $http.get("/budgetfy/program/findAllSort").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };
    })
    .service("voucherService",function($http){
        this.getAllVouchers = function(){
            return $http.get("/budgetfy/expense/findAllSort").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.findVoucherInList = function(voucherList,id){
            var foundVoucher = voucherList.filter(function(voucher){
                return (voucher.id == id);
            });
            if(foundVoucher.length>0){
                return foundVoucher[0];
            }
            return null;
        };

        this.saveVoucher = function(voucher){
            return $http.post("/budgetfy/expense/",voucher)
                .then(function successCallback(response){
                    return response
                }, function errorCallback(error) {
                    console.log(error);
                });
        };
    })
    .service("particularService",function($http){
        this.findParticularsOfVoucher = function(voucherId){

            var particular = {
                voucherId: voucherId
            };

            return $http.post("/budgetfy/particular/findEntity", particular).then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.findParticularsOfActivity = function(activityId){

            var particular = {
                activityId: activityId
            };

            return $http.post("/budgetfy/particular/findEntity", particular).then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.deleteParticular = function(particularId){
            return $http.delete("/budgetfy/particular/"+particularId).then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.findParticularFromList = function(particularList, particularId){
            var foundParticular = particularList.filter(function(particular){
                return (particular.id == particularId);
            });
            if(foundParticular.length>0){
                return foundParticular[0];
            }
            return null;
        };

    }).service("fileDetailService", function($http){
        this.downloadFile = function(fileId){
            window.location.href = evey.getHome()+"/budgetfy/file/download/"+fileId;
        };
    })
    .service("activityService",function($http){
        this.getProgramActivities = function(programId){

            var activity = {
                programId : programId
            };

            return $http.post("/budgetfy/activity/findEntity", activity).then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.findActivityInList = function(activityList, id){
            var foundActivity = activityList.filter(function(activity){
                return (activity.id == id);
            });
            if(foundActivity.length>0){
                return foundActivity[0];
            }
            return null;
        };

        this.addUpdateActivity = function(activity){
            return $http.post("/budgetfy/activity", activity).then(function successCallback(response){
                return response;
            }, function errorCallback(response){

            });
        };

        this.findActivityExpense = function(programId){
            return $http.get("/budgetfy/activity/getActivityExpense",{params:{programId:programId}}).then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.getAllActivities = function(){
            return $http.get("/budgetfy/activity/findAll").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };

        this.removeActivityFromProgram = function(activityId){
            return $http.get("/budgetfy/activity/countActivityExpense",{params:{activityId:activityId}}).then(function successCallback(response){
                if(response.data.status && response.data.count <= 0){
                    return $http.delete("/budgetfy/activity/"+activityId).then(function successCallback(deleteResponse){
                        return deleteResponse.data
                    }, function errorCallback(response){

                    });
                } else {
                    var returnData = {
                        "status":false,
                        "message": "cannot be delete"
                    };

                    return returnData;
                }
            }, function errorCallback(response){

            });
        };

    })
    .service("userRoleService", function($http){
        this.getAllUserRole = function(){
            return $http.get("/budgetfy/userRole/findAll").then(function successCallback(response){
                return response.data;
            }, function errorCallback(response){

            });
        };
    });


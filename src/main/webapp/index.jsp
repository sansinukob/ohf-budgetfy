<!doctype html>
<html class="no-js" lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense Tracker</title>

    <link rel="stylesheet" href="css/foundation.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/motion-ui.min.css">
    <link rel="stylesheet" href="css/selectize.default.css">
    <link rel="stylesheet" href="css/jquery-ui.min.css">

    <script src="js/jquery3.min.js"></script>
    <script src="js/angular.js"></script>
    <script src="js/selectize.min.js"></script>
    <script src="js/angular-selectize.js"></script>
    <script src="angular/budgetfy-angular.js"></script>
    <script src="angular/dirPagination.js"></script>
</head>
<body ng-app="budgetfyApp" ng-controller="loginController">

<section id="site-content">
    <form name="login" method="GET" action="/budgetfy/login">

    </form>
</section>

<script src="js/vendor/what-input.js"></script>
<script src="js/vendor/foundation.min.js"></script>
<script src="js/evey-1.0.js"></script>
<script src="js/Chart.min.js"></script>
<script src="js/motion-ui.min.js"></script>
<script src="js/jquery-ui.min.js"></script>
<script>
    $(document).ready(function(){
        //redirect to login page
        document.forms["login"].submit();
    });
</script>
</body>
</html>

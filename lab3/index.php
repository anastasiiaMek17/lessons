<!DOCTYPE html>
<html>

<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Lab-3</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <link rel='stylesheet' href='style.css'>
</head>

<title>Lab-3</title>

<body>

    <div class="wrapper">

        <div class="header"> <?php include('sections/header.php') ?> </div>

        <input type="checkbox" class="openSidebarMenu" id="openSidebarMenu">
        <label for="openSidebarMenu" class="sidebarIconToggle">
            <div class="spinner diagonal part-1"></div>
            <div class="spinner horizontal"></div>
            <div class="spinner diagonal part-2"></div>
        </label>
        <div id="sidebarMenu">
            <ul class="sidebarMenuInner">
                <li>Я вивчаю PHP!</li>
                <li><a href="sections/table.php" target="_blank">Таблиця</a> </li>
                <li><a href="sections/array.php" target="_blank">Масив</a> </li>
            </ul>
        </div>


        <section class="table-item" <h1>Таблиця</h1>

            <table border="table-border">
                <?php include('sections/table.php') ?>
            </table>

            <section class="array">

                <?php include('sections/array.php') ?>

            </section>
        </section>

</body>
<footer>
    <?php include('sections/footer.php') ?>
</footer>

</html>
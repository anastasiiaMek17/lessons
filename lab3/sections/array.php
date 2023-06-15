<h1>Масив</h1>

<?php

// Створюємо масив з 10 випадкових чисел в діапазоні від -10 до 10
$numbers = array();
for ($i = 0; $i < 10; $i++) {
    $numbers[] = rand(-10, 10);
}

// Виводимо масив на екран
echo "<h2>Масив у вигляді рядка:</h2>";
foreach ($numbers as $number) {
    echo $number . " ";
}

echo "<h2>Масив у вигляді стовпчика:</h2>";
foreach ($numbers as $number) {
    echo $number . "<br>";
}

echo "<h2>Масив у вигляді print_r:</h2>";
echo "<pre>";
print_r($numbers);
echo "</pre>";

$sum = 0;
foreach ($numbers as $number) {
    $sum += $number;
}
echo "<h2>Сума всіх елементів масиву: $sum</h2>";

$count = 0;
$product = 1;
$positive_numbers_sum = 0;
foreach ($numbers as $number) {
    if ($number > 0) {
        $count++;
        $positive_numbers_sum += $number;
    }
}
if ($count > 0) {
    $average = $positive_numbers_sum / $count;

    foreach ($numbers as $number) {
        if ($number > $average) {
            $product *= $number;
        }
    }

    echo "<h2>Середнє арифметичне серед додатних чисел: $average</h2>";
    echo "<h2>Добуток всіх чисел, більших за середнє арифметичне: $product</h2>";
} else {
    echo "<h2>В масиві немає додатних чисел</h2>";
}
?>
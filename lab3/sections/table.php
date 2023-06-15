<?php

$tableSize = 10;

echo "<tr><th>0</th>";
for ($index = 1; $index <= $tableSize; $index++) {
    echo "<th> $index </th>";
}
echo " </tr> ";

for ($index = 1; $index <= $tableSize; $index++) {
    echo "<tr> <th> $index </th>";
    for ($index2 = 1; $index2 <= $tableSize; $index2++) {
        echo "<td>" . ($index * $index2) . "</td>";
    }
    echo " </tr> ";
}
?>
<?php
function ArrayMultiSort($array, $field, $order = 'ASC', $second_field = '', $order2 = 'ASC'){
  $result = $array;

  usort($result, function($a, $b) use($field, $order, $second_field, $order2) {
      if(!isset($order) || trim($order) == '' || $order == null || $order == 'ASC'){
        $diff = $a[$field] - $b[$field];
      } else {
        $diff = $b[$field] - $a[$field];
      }

      if($diff <> 0 || !isset($second_field) || trim($second_field) == '' || $second_field == null) return $diff;

      if(!isset($order2) || trim($order2) == '' || $order2 == null || $order2 == 'ASC'){
        $diff2 = strcmp($a[$second_field], $b[$second_field]);
      } else {
        $diff2 = strcmp($b[$second_field], $a[$second_field]);
      }

      return $diff2;
  });

  return $result;
}

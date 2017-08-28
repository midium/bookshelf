<?php
function getStatusFromId($id) {
  switch ($id) {
    case 1:
      return 'Reading';
      break;

    case 2:
      return 'Finished';
      break;

    case 3:
      return 'Dropped';
      break;

  }
}

function getAllReadStatuses(){
  $data[] = ['value' => 1, 'label' => 'Reading'];
  $data[] = ['value' => 2, 'label' => 'Finished'];
  $data[] = ['value' => 3, 'label' => 'Dropped'];

  return $data;
}

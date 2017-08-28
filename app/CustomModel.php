<?php
namespace App;


class CustomModel extends \Eloquent {

    /**
     * Synchronized At setter
     */
    public function setUUID()
    {
      $this->uuid = generate_uuid();
    }

    /**
     * Synchronized At getter
     */
    public function getUUID()
    {
      return $this->uuid;
    }

}

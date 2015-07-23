<?php
/**
 * index.php
 * @copyright Copyright © 2015 cloud-nemo
 * @author    cloud-nemo
 */
defined('APPLICATION_ENV') || define('APPLICATION_ENV', 'local');

/**
 * Display all errors when APPLICATION_ENV is development.
 */
if ($_SERVER['APPLICATION_ENV'] == 'local') {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
}

chdir(dirname(__DIR__));

// Setup autoloading
require 'library/autoload.php';

// Run the application!
Zend\Mvc\Application::init(require_once 'config/application.config.php')->run();
<?php
/**
 * index.php
 * @copyright Copyright © 2015 cloud-nemo
 * @author    cloud-nemo
 */
chdir(dirname(__DIR__));

// Setup autoloading
require 'init_autoloader.php';

// Run the application!
Zend\Mvc\Application::init(require_once 'config/application.config.php')->run();
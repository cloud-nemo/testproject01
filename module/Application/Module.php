<?php
/**
 * Module.php
 */
/**
 * Application\Module
 *
 * @category  Application
 * @copyright Copyright © 2015 cloud nemo
 * @author    cloud nemo
 */
namespace Application;

use Zend\ModuleManager\Feature\AutoloaderProviderInterface;
use Zend\ModuleManager\Feature\ConfigProviderInterface;

class Module
    implements AutoloaderProviderInterface,
               ConfigProviderInterface
{
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }

    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__ => __DIR__ . '/',
                ),
            ),
        );
    }

}

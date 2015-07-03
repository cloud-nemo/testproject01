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

    /**
     * @param  \Zend\Mvc\MvcEvent $e The MvcEvent instance
     * @return void
     */
    public function onBootstrap($e)
    {
        // Register a render event
        $app = $e->getParam('application');
        $app->getEventManager()->attach('render', array($this, 'setLayoutTitle'));
    }

    /**
     * @param  \Zend\Mvc\MvcEvent $e The MvcEvent instance
     * @return void
     */
    public function setLayoutTitle($e)
    {
        $siteName   = 'Test-Project';

        // Getting the view helper manager from the application service manager
        $viewHelperManager = $e->getApplication()->getServiceManager()->get('viewHelperManager');

        // Getting the headTitle helper from the view helper manager
        /** @var \Zend\View\Helper\HeadTitle $headTitleHelper */
        $headTitleHelper   = $viewHelperManager->get('headTitle');
        // Setting default attach order
        $headTitleHelper->setDefaultAttachOrder('APPEND');
        // Setting a separator string for segments
        $headTitleHelper->setSeparator(' - ');
        // Setting auto-escape machanism to false
        $headTitleHelper->setAutoEscape(false);
        // Setting the Application name as first element
        $headTitleHelper->append($siteName);
    }

}

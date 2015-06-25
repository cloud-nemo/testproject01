<?php
/**
 * IndexController.php
 */
/**
 * Application\Controller\IndexController
 *
 * @category  Application
 * @copyright Copyright © 2015 cloud nemo
 * @author    cloud nemo
 */

namespace Application\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class IndexController extends AbstractActionController
{
    public function indexAction()
    {
        return new ViewModel();
    }
}

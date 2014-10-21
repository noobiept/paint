# python3

import os.path
import argparse
import sys

sys.path.append( 'C:/Users/drk/Dropbox/projects/' )


from create_release_script import create_server_template


    # relative paths
default_indexPath = '../index.html'
default_appName = 'paint'
default_copyToPath = 'C:/Users/drk/Dropbox/projects/website/templates/{}/'.format( default_appName )


def go( indexPath= default_indexPath,
        appName= default_appName,
        copyToPath= default_copyToPath,
        templateName= None ):

    indexPath = os.path.realpath( indexPath )
    copyToPath = os.path.realpath( copyToPath )

    create_server_template.go( indexPath, appName, copyToPath, templateName )



if __name__ == '__main__':

    parser = argparse.ArgumentParser( description= 'Create the server template.' )

    parser.add_argument( 'indexPath', nargs= '?', default= default_indexPath )
    parser.add_argument( 'appName', nargs= '?', default= default_appName )
    parser.add_argument( 'copyToPath', nargs= '?', default= default_copyToPath )

    args = parser.parse_args()

    go( args.indexPath, args.appName, args.copyToPath )
# python3

import argparse
import sys
import os.path

sys.path.append( 'C:/Users/drk/Dropbox/projects/' )

import create_release_script.main as main


    # relative paths
default_htmlFile = "../index.html"
default_concatenateConfig = "concatenate_config.txt"
default_copyFilesConfig = "copy_files_config.txt"
default_resultingFolder = "paint"


def go( htmlFile= default_htmlFile,
        copyFilesConfig= default_copyFilesConfig,
        concatenateConfig= default_concatenateConfig,
        resultingFolder= default_resultingFolder ):

        # absolute paths
    htmlFile = os.path.realpath( htmlFile )
    copyFilesConfig = os.path.realpath( copyFilesConfig )
    concatenateConfig = os.path.realpath( concatenateConfig )
    resultingFolder = os.path.realpath( resultingFolder )

    baseDirectory = os.path.realpath( '' )


    main.go( htmlFile, copyFilesConfig, concatenateConfig, resultingFolder, baseDirectory )


    

if __name__ == '__main__':    

    parser = argparse.ArgumentParser( description= 'Generate the release files of the program.' )

    parser.add_argument( 'htmlFile', help= 'Path to the index.html.', nargs= '?', default= default_htmlFile )
    parser.add_argument( 'copyFilesConfig', help= 'Path to the configuration file that tells which files to copy.', nargs= '?', default= default_copyFilesConfig )
    parser.add_argument( 'concatenateConfig', help= 'Path to the configuration file to tell which files to concatenate (and the order).', nargs= '?', default= default_concatenateConfig )
    parser.add_argument( 'resultingFolder', help= "Name of the folder that is created in the current path and contains the copies.", nargs= "?", default= default_resultingFolder )


    args = parser.parse_args()

    go( args.htmlFile, args.copyFilesConfig, args.concatenateConfig, args.resultingFolder )

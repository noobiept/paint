# python3

import argparse
import json
import shutil

import os
import os.path


def copyFiles( config ):

    """
        config:
            if a string, its the path to the configuration file
            otherwise is an object/dict

        Format of configuration file/object:

        {
            "resultingFolder": "something",
            "basePath": "something",
            "files":
                [
                "pathToFile.py",
                "pathToFolder/",         # copies recursively all the contents of the folder
                ]
        }
    """

        # means its the path to the configuration file
        # otherwise, its already as an object/dictionary
    if isinstance( config, str ):

        with open( config, 'r', encoding='utf-8' ) as f:
                # parse the json file into an object/dictionary
            config = json.loads( f.read() )



    currentDirectory = os.path.dirname( os.path.abspath(__file__) )

        # to where we are going to copy stuff
    resultingFolder = os.path.join( currentDirectory, config['resultingFolder'] )

        # from where the paths in the configuration are based from (they're relative to this)
    baseDirectory = os.path.abspath( os.path.join(currentDirectory, config['basePath']) )


       # go through all the files in the configuration
    for fileOrFolder in config['files']:

            # a file or a folder
        if isinstance( fileOrFolder, str ):

            sourceFileOrFolder = os.path.join( baseDirectory, fileOrFolder )


                # a folder, copy all the files there
            if os.path.isdir( sourceFileOrFolder ):

                copyAllFilesFromFolder( baseDirectory, fileOrFolder, resultingFolder )

                # copy an individual file
            else:

                copyIndividualFile( baseDirectory, fileOrFolder, resultingFolder )

            # an error
        else:
            raise Exception( "Wrong type in JSON: Has to be a string: {}.".format( fileOrFolder ) )




    

def copyAllFilesFromFolder( baseDirectory, pathToFolder, resultingFolder ):

    """
        Recursively copies the folder:

            baseDirectory/pathToFolder

        into:
            resultingFolder/pathToFolder
    """

    sourceFolder = os.path.join( baseDirectory, pathToFolder )

    destinationFolder = os.path.join( resultingFolder, pathToFolder )



        # create if doesn't exist
    if not os.path.isdir( destinationFolder ):
        os.makedirs( destinationFolder )

    allFiles = os.listdir( sourceFolder )

    for aFile in allFiles:

        sourceFilePath = os.path.join( sourceFolder, aFile )

        destinationFilePath = os.path.join( destinationFolder, aFile )

            # if there's another folder, call this function again (recursively)
        if os.path.isdir( sourceFilePath ):

            copyAllFilesFromFolder( baseDirectory, os.path.join( pathToFolder, aFile ), resultingFolder )
            continue

        shutil.copy( sourceFilePath, destinationFilePath )




def copyIndividualFile( baseDirectory, pathToFile, resultingFolder ):

    """
        Copies a single file from:

            baseDirectory/pathToFile

        into:
            resultingFolder/pathToFile
    """

    sourcePath = os.path.join( baseDirectory, pathToFile )

    destinationPath = os.path.join( resultingFolder, pathToFile )

    directory = os.path.dirname( destinationPath )

    if not os.path.exists( directory ):
        os.makedirs( directory )


    shutil.copy( sourcePath, destinationPath )





if __name__ == '__main__':    

    parser = argparse.ArgumentParser( description = 'Copy files according to a configuration file.' )

    parser.add_argument( 'configPath', help = "path to the configuration file.", nargs="?", default="copy_files_config.txt" )

    args = parser.parse_args()


    copyFiles( args.configPath )

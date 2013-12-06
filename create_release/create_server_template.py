import os.path
import re
import argparse

from bs4 import BeautifulSoup



def go( resultingFolder ):

        # update the base.html to point to the paint's minimized file

    pathBaseHtml = os.path.join( resultingFolder, 'templates/pagina/base.html' )

    with open( pathBaseHtml, 'r' ) as f:
        baseContent = f.read()

    soup = BeautifulSoup( baseContent )

    scripts = soup.find_all( 'script' )

    paintScripts = []

        # identify the paint's scripts
    for aScript in scripts:

        src = aScript.get( 'src' )


            # confirm that it has a 'src' attribute, and that it has the 'paint' string somewhere on its path
        if src and re.search( 'paint', src ):

            paintScripts.append( aScript )


        # remove all but one
    minimizedPaint = paintScripts.pop()

    for aScript in paintScripts:
        aScript.decompose()

        # change the source to point to the minimized script
    minimizedPaint['src'] = '{{ STATIC_URL }}paint/minimized.js'

        # save back to base.html
    with open( pathBaseHtml, 'w' ) as f:
        f.write( str( soup ) )



if __name__ == '__main__':

    parser = argparse.ArgumentParser( description= "Update the server's base.html template."  )

    parser.add_argument( 'resultingFolder' )

    args = parser.parse_args()

    go( args.resultingFolder )


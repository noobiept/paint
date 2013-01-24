import urllib.parse
import urllib.request

import re
import string


def css( pathToFile ):
    
    with open( pathToFile, 'r', encoding="utf-8") as f:
        code = f.read()
        
    
    code = cssRemoveComments( code )
    
    #code = cssRemoveTrailingSpace( code )
    

    
    
    with open( pathToFile, 'w', encoding="utf-8") as f:
        f.write( code ) 
    


def cssRemoveTrailingSpace( code ):
    
    codeBlocks = []
    
    
    startRule = code.find('{')
    
    while startRule >= 0:
    
            # remove the whitespace to the left of the css selectors
        code = code.lstrip()
        
        
            # brace that ends a css rule
        endRule = code.find('}')

            # save the block of code of this rule        
        codeBlocks.append(code[:endRule + 1])
        
        code = code[ endRule + 1 : ]
    
            # see if there are more css rules    
        startRule = code.find('{')
        
    
        # clean the whitespace on each rule
    codeBlocks = cssCleanRules( codeBlocks )
    
        # join everything
    codeAgain = ""
    
    for blocks in codeBlocks:
        codeAgain += blocks
        
    return codeAgain

    

"""
    Cleans a single css rule at a time
    
    Arguments:
    
        codeBlocks (list) : list of strings, each one being a css rule
"""

def cssCleanRules( codeBlocks ):
    
    blocks = []
    
           # remove the whitespace between the css selectors and the start of the css rule
    for block in codeBlocks:
        
            # find opening of rule
        startRule = block.find('{')
            
        endSelector = startRule - 1
        
            # find end of selectors
        while block[endSelector] in string.whitespace:
            
            endSelector -= 1 
    
        
        block = block[:endSelector+1] + block[startRule:]
    
        blocks.append(block)
    
    return blocks

    
    
def cssRemoveComments( code ):
    
            # remove the comments
    begin = code.find('/*')
    
    
        # while we still find the beginning of the comment
    while begin >= 0:
        
        end = code.find('*/')
        
            # the +2 is to remove the "*/"
        code = code[ : begin] + code[end + 2 : ]
        
            # try again
        begin = code.find('/*')
        
    return code
    
    
    
    
'''
    Substitutes the content of the file with the optimized version (from closure compiler)
'''

def js( pathToFile, compilationLevel='SIMPLE_OPTIMIZATIONS' ):

        # get the code
    with open( pathToFile, 'r', encoding="utf-8") as f:
        code = f.read()


    data = urllib.parse.urlencode({'compilation_level': compilationLevel, 'output_format': 'text', 
                                   'output_info': 'compiled_code', 'js_code': code })

        # we have to send in bytes
    data = data.encode('utf-8')

    connection = urllib.request.urlopen("http://closure-compiler.appspot.com/compile", data)

    result = connection.read()
    
        # result is in bytes, turn it into a string
    result = result.decode('utf-8')
    
        # write the optimized code back in the same file
    with open( pathToFile, 'w', encoding="utf-8") as f:
        f.write( result )
        
        
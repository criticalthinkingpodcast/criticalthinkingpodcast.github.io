/**
 * Code Formatting Enhancement Script
 * Adds language labels and handles code block styling
 */
document.addEventListener('DOMContentLoaded', function() {
    // Find all code blocks with language classes
    const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
    
    // Process each code block
    codeBlocks.forEach(function(codeBlock) {
        // Get the parent pre element
        const preElement = codeBlock.parentElement;
        
        // Add code-highlight class to the pre element
        preElement.classList.add('code-highlight');
        
        // Extract language from class (format: language-xxx)
        const classes = codeBlock.className.split(' ');
        let language = '';
        
        for (let i = 0; i < classes.length; i++) {
            if (classes[i].startsWith('language-')) {
                language = classes[i].replace('language-', '');
                break;
            }
        }
        
        // Enhanced language detection
        if (language) {
            language = language.toUpperCase();
            
            // Normalize some language names
            switch (language) {
                case 'JS':
                    language = 'JAVASCRIPT';
                    break;
                case 'TS':
                    language = 'TYPESCRIPT';
                    break;
                case 'PY':
                    language = 'PYTHON';
                    break;
                case 'YML':
                    language = 'YAML';
                    break;
            }

            // Set data attribute on pre element for styling
            preElement.setAttribute('data-language', language);
            
            // Create and add language label
            const label = document.createElement('div');
            label.className = 'code-language-label';
            label.textContent = language;
            preElement.appendChild(label);
        }
        
        // Get the content of the code block
        const content = codeBlock.textContent;
        
        // Specialized formatting for different code types
        // Check if this is an OAuth-related code block
        const isOAuthBlock = 
            content.includes('oauth') || 
            content.includes('client_id') || 
            content.includes('redirect_uri');
          // Enhanced GraphQL detection
        const isGraphQLBlock = 
            (content.includes('query') && content.includes('{')) || 
            (content.includes('type') && content.includes('{')) ||
            (content.includes('fragment') && content.includes('on')) ||
            (content.includes('mutation') && content.includes('{')) ||
            (content.includes('subscription') && content.includes('{')) ||
            // Pattern for detecting the example from the image
            (content.includes('publicData:') && content.includes('restrictedData:'));

        if (isOAuthBlock) {
            // Set the parent pre element data-language attribute to OAuth
            preElement.setAttribute('data-language', 'OAUTH');
            
            // Style OAuth code blocks specially
            preElement.classList.add('oauth-code');
        }
        
        if (isGraphQLBlock && !language) {
            preElement.setAttribute('data-language', 'GRAPHQL');
            preElement.classList.add('graphql-code');
            
            if (!preElement.querySelector('.code-language-label')) {
                const label = document.createElement('div');
                label.className = 'code-language-label';
                label.textContent = 'GRAPHQL';
                preElement.appendChild(label);
            }
            
            // Add additional GraphQL formatting for better visualization
            try {
                // Check if it's the specific example from the image
                if (content.includes('publicData:') && content.includes('restrictedData:')) {
                    // Apply special formatting for the GraphQL aliasing example
                    codeBlock.innerHTML = codeBlock.innerHTML
                        .replace(/query/g, '<span style="color: #ff79c6; font-weight: bold;">query</span>')
                        .replace(/publicData:/g, '<span style="color: #50fa7b;">publicData:</span>')
                        .replace(/restrictedData:/g, '<span style="color: #50fa7b;">restrictedData:</span>')
                        .replace(/user\(id:/g, '<span style="color: #8be9fd;">user</span><span style="color: #f8f8f2;">(</span><span style="color: #ff9d00;">id:</span>')
                        .replace(/name/g, '<span style="color: #50fa7b;">name</span>')
                        .replace(/email/g, '<span style="color: #50fa7b;">email</span>')
                        .replace(/ssn/g, '<span style="color: #50fa7b;">ssn</span>')
                        .replace(/accountBalance/g, '<span style="color: #50fa7b;">accountBalance</span>');
                }
            } catch (e) {
                console.error('Error applying special GraphQL formatting:', e);
            }
        }
        
        // Add copy button to code blocks
        addCopyButton(preElement, content);
    });
    
    // Function to add copy button to code blocks
    function addCopyButton(preElement, content) {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.innerText = 'Copy';
        
        copyButton.addEventListener('click', function() {
            navigator.clipboard.writeText(content).then(function() {
                copyButton.innerText = 'Copied!';
                copyButton.classList.add('copied');
                
                setTimeout(function() {
                    copyButton.innerText = 'Copy';
                    copyButton.classList.remove('copied');
                }, 2000);
            }, function(err) {
                console.error('Failed to copy: ', err);
                copyButton.innerText = 'Failed';
                
                setTimeout(function() {
                    copyButton.innerText = 'Copy';
                }, 2000);
            });
        });
        
        preElement.appendChild(copyButton);
    }
});

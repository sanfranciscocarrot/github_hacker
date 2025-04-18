import streamlit as st
from openai import OpenAI
import os
from typing import List, Dict, Any, Optional

# Initialize session state for chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_openai_response(messages: List[Dict[str, str]]) -> str:
    """Get response from OpenAI model"""
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error getting response: {str(e)}"

def display_chat_history():
    """Display chat history using Streamlit's chat_message"""
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.write(message["content"])

def main():
    st.title("Flexible Chatbot Framework")
    
    # Display chat history
    display_chat_history()
    
    # Chat input
    if prompt := st.chat_input("What would you like to know?"):
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})
        
        # Display user message
        with st.chat_message("user"):
            st.write(prompt)
            
        # Get and display assistant response
        with st.chat_message("assistant"):
            response = get_openai_response(st.session_state.messages)
            st.write(response)
            st.session_state.messages.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main()

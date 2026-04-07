user_input = input("Enter a word")

def palindrome(user_input):
    rev = ""

    for ch in user_input:
        rev = ch + rev

    if rev == user_input:
        return "Palindrome"

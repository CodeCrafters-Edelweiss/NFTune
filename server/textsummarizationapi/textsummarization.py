from transformers import pipeline

summarizer = pipeline('summarization')

article = """
Entrepreneurship is the ability and readiness to develop, organize and run a business enterprise, along with any of its uncertainties in order to make a profit. The most prominent example of entrepreneurship is the starting of new businesses.
In economics, entrepreneurship connected with land, labour, natural resources and capital can generate a profit. The entrepreneurial vision is defined by discovery and risk-taking and is an indispensable part of a nation’s capacity to succeed in an ever-changing and more competitive global marketplace.

The entrepreneur is defined as someone who has the ability and desire to establish, administer and succeed in a startup venture along with risk entitled to it, to make profits. The best example of entrepreneurship is the starting of a new business venture. The entrepreneurs are often known as a source of new ideas or innovators, and bring new ideas in the market by replacing old with a new invention.

It can be classified into small or home business to multinational companies. In economics, the profits that an entrepreneur makes is with a combination of land, natural resources, labour and capital.

In a nutshell, anyone who has the will and determination to start a new company and deals with all the risks that go with it can become an Entrepreneur.

"""

x = summarizer(article,max_length=100,min_length=1,do_sample=False)
print(x)

Output = "[{'summary_text': ' Entrepreneur is defined as someone who has the ability and desire to establish, administer and succeed in a startup venture along with risk entitled to it, to make profits . Entrepreneurship is defined by discovery and risk-taking and is an indispensable part of a nation’s capacity to succeed in an ever-changing and more competitive global marketplace .'}]"
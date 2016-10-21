# route66

Usage: `index.js example.com input-file.txt`

Given AWS credentials in the usual environment variables, and given an input file with lines that look like this:

```
foo.example.com foo-is-cname-for-this.example.com
baz.example.com baz-cname.example.com
qux.example.com qux-cname.example.com
```

Add CNAME records to AWS Route 53.

## License

ISC.

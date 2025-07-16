-- Create a function to execute admin SQL queries
CREATE OR REPLACE FUNCTION execute_admin_sql(sql_query TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    EXECUTE sql_query INTO result;
    RETURN result;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Error executing SQL query: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

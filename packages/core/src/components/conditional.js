export function deepFind(obj, path, relative_path) {
  if (obj == null || typeof obj == undefined) {
    return null;
  }

  // Handle Relative Paths
  if (path.search("./") != -1 && typeof relative_path != "undefined") {
    path = path.replace("./", "");

    // Detect JsonSchema formatting using _ as object path separator
    // Code has to handle invalid routes, as var name may also use underscore
    // i.e.: customer.firt_name
    let explode_parts = relative_path.split("_");
    let fixed_path = "";
    let neddle = obj;

    for (let i = 0; i < explode_parts.length; ++i) {
      if (isNaN(explode_parts[i]) == false) {
        if (neddle.length > explode_parts[i]) {
          if (fixed_path != "") {
            fixed_path += ".";
          }
          fixed_path += explode_parts[i];
          neddle = neddle[explode_parts[i]];
        } else {
          //console.log('undefined index detected: ' + fixed_path + ' [] ' + explode_parts[i]);
          return null;
        }
      }

      // direct mode (1)
      else if (typeof neddle[explode_parts[i]] != "undefined") {
        if (fixed_path != "") {
          fixed_path += ".";
        }
        fixed_path += explode_parts[i];
        neddle = neddle[explode_parts[i]];
      }
      // mixed name mode (2)
      else {
        let node_tmp = explode_parts[i];
        for (let j = i + 1; j < explode_parts.length; j++) {
          node_tmp += "_" + explode_parts[j];
          if (typeof neddle[node_tmp] != "undefined") {
            if (fixed_path != "") {
              fixed_path += ".";
            }
            fixed_path += node_tmp;
            neddle = neddle[node_tmp];
            // push i to the lates j used
            i = j;
          }
        }
      }
    }

    // Complete the Relative path (only for debugging purposes)
    fixed_path += "." + path;
    return neddle != null && typeof neddle[path] == "undefined"
      ? null
      : neddle[path];
  }

  var paths = path.split("."),
    current = obj,
    i;

  for (i = 0; i < paths.length; ++i) {
    if (typeof current[paths[i]] == "undefined") {
      return undefined;
    } else {
      current = current[paths[i]];
    }
  }

  return current;
}

export function deepFindSchema(schema, path) {
  if (schema == null || typeof schema == undefined) {
    return null;
  }

  let needle = schema;
  const parts = path.split(".");
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (part === "") {
      continue;
    }

    if (
      needle.type == "object" &&
      typeof needle.properties != "undefined" &&
      typeof needle.properties[part] != "undefined"
    ) {
      needle = needle.properties[part];
      if (needle.type != "object") {
        return needle;
      }
    }
  }

  return null;
}

/**
 * This funtion evaluates 1 condition
 */
export function evalConditional(value, condition) {
  // @todo: implement transforms prior evaluation

  switch (condition.operator) {
    // Array operators
    case "ARRAY-INTERSECT":
      if (
        typeof condition.value == "object" &&
        typeof value == "object" &&
        value != null
      ) {
        let intersect = condition.value.filter(
          neddle => value.indexOf(neddle) !== -1
        );
        return intersect.length >= 1;
      }
      return false;

    case "ARRAY-NOT-INTERSECT":
      if (
        typeof condition.value == "object" &&
        typeof value == "object" &&
        value != null
      ) {
        let intersect = condition.value.filter(
          neddle => value.indexOf(neddle) !== -1
        );
        return intersect.length == 0;
      }
      return false;

    case "IN":
    case "in":
      return condition.value.indexOf(value) != -1;

    case "NOT IN":
    case "not in":
      return condition.value.indexOf(value) == -1;

    case "INCLUDES":
    case "includes":
      if (value != null && typeof value == "object") {
        return Object.values(value).indexOf(condition.value) != -1;
      }
      return false;

    // Numeric ans String Operators
    case ">=":
      return value >= condition.value;

    case ">":
      return value > condition.value;

    case "<=":
      return value <= condition.value;

    case "<":
      return value < condition.value;

    case "!=":
      return value != condition.value;

    case "==":
    default:
      return value == condition.value;
  }
}

/**
 * This function iterates through all conditions defined
 */
export function evaluateAllConditions(conditional) {
  // Multiple Condition Definition
  if (typeof conditional.subConditions != "undefined") {
    let res = conditional.subConditions.map(condition => {
      // recusive nodes detection
      if (typeof condition.subConditions != "undefined") {
        return evalConditional(condition);
      }

      let value =
        typeof condition.input != "undefined" ? condition.input : null;

      // TODO >> replace conditional.children to a better format so we can support recusive definitions
      if (typeof value == "object" && value != null) {
        // Global condition to operate in the array
        if (typeof condition.children == "undefined") {
          return evalConditional(value, condition);
        }

        // Multiple rule evaluation through the array of nodes
        if (typeof condition.children.subConditions != "undefined") {
          let arrayEvaluation = [];

          for (let ind = 0; ind < value.length; ind++) {
            let chilEvaluations = [];
            for (
              let cInd = 0;
              cInd < condition.children.subConditions.length;
              cInd++
            ) {
              let childCondition = condition.children.subConditions[cInd];
              let childValue = deepFind(value[ind], childCondition.data);
              let res = evalConditional(childValue, childCondition);
              chilEvaluations.push(res);
            }
            let childCondRes = mergeByOperator(chilEvaluations, "AND");
            arrayEvaluation.push(childCondRes);
          }

          return mergeByOperator(arrayEvaluation, condition.operator);
        }

        // Single rule evaluation through the array of nodes
        else if (
          typeof condition.children.data != "undefined" &&
          typeof condition.children.value != "undefined"
        ) {
          let arrayEvaluation = [];
          for (let ind = 0; ind < value.length; ind++) {
            let childValue = deepFind(value[ind], condition.children.data);
            arrayEvaluation.push(
              evalConditional(childValue, condition.children)
            );
          }
          return mergeByOperator(arrayEvaluation, condition.operator);
        }
      }

      return evalConditional(value, condition);
    });

    return mergeByOperator(res, conditional.operator);
  }

  // Simple 1 Rule Condition
  if (typeof conditional.data != "undefined") {
    let value =
      typeof conditional.input != "undefined" ? conditional.input : null;
    return evalConditional(value, conditional);
  }
}

export function mergeByOperator(values, operator) {
  if (values.length > 0) {
    switch (operator) {
      case "||":
      case "OR":
      case "or":
        return values.reduce((current, next) => {
          return current || next;
        });

      case "&&":
      case "AND":
      case "and":
      default:
        return values.reduce((current, next) => {
          return current && next;
        });
    }
  }
  return false;
}
